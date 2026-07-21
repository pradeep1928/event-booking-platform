
import { AppException } from './AppException.js';

export class BadRequestException extends AppException {
  constructor(message = 'Bad Request') {
    super(message, 400);
  }
}