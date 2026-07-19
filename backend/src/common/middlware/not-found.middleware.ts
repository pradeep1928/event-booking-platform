import { Request, Response } from 'express';
import type { RequestHandler } from 'express';

export const notFoundHandler: RequestHandler = (_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
};