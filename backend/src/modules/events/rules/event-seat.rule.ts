import { BadRequestException } from '../../../common/exceptions/BadRequestException.js';

export function validateSeats(
  totalSeats: number,
): void {

  if (totalSeats <= 0) {
    throw new BadRequestException(
      'Total seats must be greater than zero',
    );
  }

}