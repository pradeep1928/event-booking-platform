import { Prisma } from "@prisma/client";

export const calculateTotalAmount = (
  unitPrice: Prisma.Decimal,
  ticketCount: number,
) => {
  return unitPrice.mul(ticketCount);
};

export const isFreeAmount = (
  amount: Prisma.Decimal,
) => {
  return amount.equals(0);
};