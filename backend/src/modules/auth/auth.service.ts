import bcrypt from 'bcrypt';
import crypto from 'node:crypto';

import { hashService } from '../../infrastructure/crypto/hash.service.js';
import { AuthRepository } from './auth.repository.js';
import type { LoginDto, RefreshTokenDto, RegisterDto, ResetPasswordDto } from './auth.validation.js';
import { ConflictError } from '../../common/errors/conflict.error.js';
import { passwordService } from '../../infrastructure/crypto/password.service.js';
import { LoginResponse } from './auth.types.js';
import { UnauthorizedException } from '../../common/exceptions/UnauthorizedException.js';
import { jwtService } from '../../infrastructure/jwt/jwt.service.js';
import type { ChangePasswordDto } from './auth.validation.js';
import { NotFoundException } from '../../common/exceptions/NotFoundException.js';

import { ForgotPasswordDto } from './auth.validation.js';
import { mailService } from '../../infrastructure/mail/mail.service.js';
import { renderForgotPasswordTemplate } from '../../infrastructure/mail/templates/forgot-password.js';

export class AuthService {
    constructor(private readonly repository = new AuthRepository()) { }

    // register user
    async register(data: RegisterDto) {
        const existingUser = await this.repository.findUserByEmail(data.email);

        if (existingUser) {
            throw new ConflictError('Email already exists');
        }

        const hashedPassword = await passwordService.hash(
            data.password
        );

        return this.repository.createUser({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: hashedPassword,
        });
    }

    // login user
    async login(data: LoginDto): Promise<LoginResponse> {
        const user =
            await this.repository.findUserByEmail(data.email);

        if (!user) {
            throw new UnauthorizedException(
                'Invalid email or password',
            );
        }
        const passwordValid =
            await passwordService.compare(
                data.password,
                user.password,
            );

        if (!passwordValid) {
            throw new UnauthorizedException(
                'Invalid email or password',
            );
        }

        const accessToken =
            await jwtService.generateAccessToken({
                sub: user.id,
                email: user.email,
                role: user.role,
            });

        const jti = crypto.randomUUID();

        const refreshToken =
            await jwtService.generateRefreshToken({
                sub: user.id,
                jti,
            });

        const tokenHash =
            hashService.sha256(refreshToken);

        await this.repository.saveRefreshToken({
            jti,
            tokenHash,
            expiresAt:
                jwtService.getRefreshTokenExpiryDate(),

            userId: user.id,
        });

        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
            },
        };

    }

    // refresh token
    async refreshToken(
        data: RefreshTokenDto,
    ): Promise<LoginResponse> {
        const payload =
            await jwtService.verifyRefreshToken(
                data.refreshToken,
            );

        const tokenHash =
            hashService.sha256(
                data.refreshToken,
            );

        const stored =
            await this.repository.findRefreshTokenByHash(
                tokenHash,
            );

        if (!stored) {
            throw new UnauthorizedException(
                'Invalid refresh token',
            );
        }

        if (stored.expiresAt < new Date()) {
            throw new UnauthorizedException(
                'Refresh token expired',
            );
        }

        const user =
            await this.repository.findById(
                stored.userId,
            );

        if (!user) {
            throw new UnauthorizedException();
        }

        await this.repository.deleteRefreshToken(
            stored.id,
        );

        const accessToken = await jwtService.generateAccessToken({
            sub: user.id,
            email: user.email,
            role: user.role,
        });

        const newJti =
            crypto.randomUUID();

        const refreshToken =
            await jwtService.generateRefreshToken({
                sub: user.id,
                jti: newJti,
            });

        const hash =
            hashService.sha256(
                refreshToken,
            );

        await this.repository.saveRefreshToken({
            jti: newJti,
            tokenHash: hash,
            expiresAt:
                jwtService.getRefreshTokenExpiryDate(),
            userId: user.id,
        });

        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
            },
        };
    }

    // logout user
    async logout(refreshToken: string): Promise<void> {
        const payload =
            await jwtService.verifyRefreshToken(refreshToken);

        await this.repository.deleteByJti(payload.jti);
    }

    // logout user all 
    async logoutAll(userId: string): Promise<void> {
        await this.repository.revokeAllRefreshTokens(userId);
    }

    // change password method
    async changePassword(
        userId: string,
        data: ChangePasswordDto,
    ): Promise<void> {

        // Find user
        const user = await this.repository.findById(userId);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Verify current password
        const isPasswordValid =
            await passwordService.compare(
                data.currentPassword,
                user.password,
            );

        if (!isPasswordValid) {
            throw new UnauthorizedException(
                'Current password is incorrect',
            );
        }

        // Hash new password
        const hashedPassword =
            await passwordService.hash(
                data.newPassword,
            );

        // // Update password
        // await this.repository.updatePassword(
        //     userId,
        //     hashedPassword,
        // );

        // // Logout from all devices
        // await this.repository.revokeAllRefreshTokens(
        //     userId,
        // );

        // update password and revoke sessions
        await this.repository.updatePasswordAndRevokeSessions(
            userId,
            hashedPassword,
        );
    }

    // forgot password reset
    async forgotPassword(
        data: ForgotPasswordDto,
    ): Promise<void> {

        // Find user
        const user = await this.repository.findUserByEmail(
            data.email,
        );

        /**
         * Never reveal whether the email exists.
         * Always return success.
         */
        if (!user) {
            return;
        }

        // Generate secure random token
        const token = crypto
            .randomBytes(32)
            .toString('hex');

        // Hash before storing
        const tokenHash =
            hashService.sha256(token);

        // Token expires in 15 minutes
        const expiresAt = new Date(
            Date.now() + 15 * 60 * 1000,
        );

        // Replace any existing reset token
        await this.repository.replacePasswordResetToken({
            userId: user.id,
            tokenHash,
            expiresAt,
        });

        // Send email
        await mailService.send({
            to: user.email,
            subject: 'Reset your password',
            html: renderForgotPasswordTemplate(
                token,
            ),
        });
    }

    // reset password 
    async resetPassword(
        data: ResetPasswordDto,
    ): Promise<void> {

        // Hash incoming token
        const tokenHash =
            hashService.sha256(
                data.token,
            );

        // Find token
        const stored =
            await this.repository.findPasswordResetTokenByHash(
                tokenHash,
            );

        if (!stored) {
            throw new UnauthorizedException(
                'Invalid or expired reset token',
            );
        }

        // Check expiry
        if (
            stored.expiresAt <
            new Date()
        ) {

            await this.repository.deletePasswordResetToken(
                stored.id,
            );

            throw new UnauthorizedException(
                'Reset token has expired',
            );

        }

        // Hash new password
        const hashedPassword =
            await passwordService.hash(
                data.password,
            );

        // Transaction
        await this.repository.resetPasswordTransaction({
            userId:
                stored.user.id,

            hashedPassword,

            resetTokenId:
                stored.id,
        });

    }
}