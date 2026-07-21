import bcrypt from 'bcrypt';
import { authConfig } from '../../config/auth.config.js';


export class PasswordService {
  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, authConfig.bcrypt.saltRounds);
  }

  async compare(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}

export const passwordService = new PasswordService();