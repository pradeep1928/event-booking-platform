import { Request, Response } from "express";

import { UserService } from "./user.service.js";

import { userIdParamsSchema, getUsersQuerySchema , updateUserRoleBodySchema } from "./user.validation.js";

import { successResponse } from "../../common/utils/api-response.js";

export class UserController {
  constructor(private readonly service = new UserService()) {}

  // Get all users
  getAll = async (req: Request, res: Response): Promise<void> => {
    const query = getUsersQuerySchema.parse(req.query);
    const result = await this.service.findAll(query);
    successResponse(res, result);
  };

  // Get user by Id
  getById = async (req: Request, res: Response): Promise<void> => {
    const id = userIdParamsSchema.parse(req.params);
    const user = await this.service.findById(id);
    successResponse(res, user);
  };


  // update role - user -> org, org -> user
  updateRole = async (
  req: Request,
  res: Response,
): Promise<void> => {

  const payload =
    updateUserRoleBodySchema.parse({
      ...req.params,
      ...req.body,
    });

  const result =
    await this.service.updateRole(
      payload,
    );

  successResponse(
    res,
    result,
    'User role updated successfully',
  );
};
}
