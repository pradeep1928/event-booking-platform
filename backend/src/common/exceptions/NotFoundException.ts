

import { AppException } from './AppException.js';

export class NotFoundException extends AppException {
  constructor(message = 'NotFoundException') {
    super(message, 400);
  }
}