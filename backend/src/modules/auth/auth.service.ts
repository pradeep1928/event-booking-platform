import bcrypt from 'bcrypt';
import { AuthRepository } from './auth.repository.js';
import type { LoginDto, RegisterDto } from './auth.validation.js';
import {ConflictError} from '../../common/errors/conflict.error.js';
import { passwordService } from '../../infrastructure/crypto/password.service.js';
import { LoginResponse } from './auth.types.js';
import { UnauthorizedException } from '../../common/exceptions/UnauthorizedException.js';
import { jwtService } from '../../infrastructure/jwt/jwt.service.js';

export class AuthService {
  constructor(private readonly repository = new AuthRepository()) {}

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

    const refreshToken =
    await jwtService.generateRefreshToken({
        sub: user.id,
        email: user.email,
        role: user.role,
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
}