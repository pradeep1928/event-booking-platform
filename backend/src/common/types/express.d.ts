import "express";
import { AuthenticatedUser } from "./authenticated-user.ts";

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export {};