import { env } from './env.js';

export const authConfig = {

  bcrypt: {
    saltRounds: env.BCRYPT_SALT_ROUNDS,
  },

  accessToken: {
    secret: env.JWT_ACCESS_SECRET,
    expiresIn: env.JWT_ACCESS_EXPIRES_IN,
  },

  refreshToken: {
    secret: env.JWT_REFRESH_SECRET,
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  },

};