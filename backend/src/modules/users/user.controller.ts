import { Request, Response } from "express";

import { UserService } from "./user.service.js";

import { getUserByIdSchema, getUsersSchema } from "./user.validation.js";

import { successResponse } from "../../common/utils/api-response.js";

export class UserController {
  constructor(private readonly service = new UserService()) {}

  // Get all users
  getAll = async (req: Request, res: Response): Promise<void> => {
    const query = getUsersSchema.parse(req.query);
    const result = await this.service.findAll(query);
    successResponse(res, result);
  };

  // Get user by Id
  getById = async (req: Request, res: Response): Promise<void> => {
    const id = getUserByIdSchema.parse(req.params);
    const user = await this.service.findById(id);
    successResponse(res, user);
  };
}
