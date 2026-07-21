
import { AppException } from './AppException.js';

export class UnauthorizedException extends AppException {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}