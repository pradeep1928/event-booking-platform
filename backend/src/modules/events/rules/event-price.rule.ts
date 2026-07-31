import { Decimal } from '@prisma/client/runtime/library';
import { BadRequestException } from '../../../common/exceptions/BadRequestException.js';

export function validateEventPrice(
  price: number | Decimal,
): void {

  if (Number(price) < 0) {
    throw new BadRequestException(
      'Price cannot be negative',
    );
  }

}