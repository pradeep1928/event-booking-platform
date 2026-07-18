import { Response } from 'express';

export function successResponse<T>(
  res: Response,
  data: T,
  message = 'Success',
  statusCode = 200,
) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

export function errorResponse(
  res: Response,
  message = 'Internal Server Error',
  statusCode = 500,
  errors: unknown[] = [],
) {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
}