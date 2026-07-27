import { Request, Response } from "express";

import { UserService } from "./user.service.js";

import { getUsersSchema } from "./user.validation.js";

import { successResponse } from "../../common/utils/api-response.js";

export class UserController {
  constructor(private readonly service = new UserService()) {}

  getAll = async (req: Request, res: Response): Promise<void> => {
    const query = getUsersSchema.parse(req.query);

    const result = await this.service.findAll(query);

    successResponse(res, result);
  };
}
