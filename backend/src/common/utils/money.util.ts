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

export const toMinorCurrencyUnit = (
  amount: Prisma.Decimal,
): number => {
  const minorAmount = amount.mul(100);

  if (!minorAmount.isInteger()) {
    throw new Error(
      "Amount contains more than two decimal places",
    );
  }

  return minorAmount.toNumber();
};