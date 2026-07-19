import bcrypt from 'bcrypt';
import { AuthRepository } from './auth.repository.js';
import type { RegisterDto } from './auth.validation.js';

export class AuthService {
  constructor(private readonly repository = new AuthRepository()) {}

  async register(data: RegisterDto) {
    const existingUser = await this.repository.findUserByEmail(data.email);

    if (existingUser) {
      throw new Error('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(
      data.password,
      Number(process.env.BCRYPT_SALT_ROUNDS),
    );

    return this.repository.createUser({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: hashedPassword,
    });
  }
}