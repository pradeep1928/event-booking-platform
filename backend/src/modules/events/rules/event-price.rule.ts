import { BadRequestException } from '../../../common/exceptions/BadRequestException.js';

export function validatePrice(
  price: number,
): void {

  if (price < 0) {
    throw new BadRequestException(
      'Price cannot be negative',
    );
  }

}