

import { AppException } from './AppException.js';

export class ForbiddenException extends AppException {
  constructor(message = 'ForbiddenException') {
    super(message, 400);
  }
}