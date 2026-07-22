import bcrypt from 'bcrypt';
import crypto from 'node:crypto';

import { hashService } from '../../infrastructure/crypto/hash.service.js';
import { AuthRepository } from './auth.repository.js';
import type { LoginDto, RefreshTokenDto, RegisterDto } from './auth.validation.js';
import { ConflictError } from '../../common/errors/conflict.error.js';
import { passwordService } from '../../infrastructure/crypto/password.service.js';
import { LoginResponse } from './auth.types.js';
import { UnauthorizedException } from '../../common/exceptions/UnauthorizedException.js';
import { jwtService } from '../../infrastructure/jwt/jwt.service.js';

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
}