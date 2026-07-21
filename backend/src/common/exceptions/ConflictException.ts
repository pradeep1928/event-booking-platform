
import { AppException } from './AppException.js';

export class ConflictException extends AppException {
  constructor(message = 'ConflictException') {
    super(message, 400);
  }
}