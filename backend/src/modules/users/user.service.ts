import { Role } from "@prisma/client";
import { BadRequestException } from "../../common/exceptions/BadRequestException.js";
import { NotFoundException } from "../../common/exceptions/NotFoundException.js";
import { UserRepository } from "./user.repository.js";
import {
  GetUserByIdDto,
  GetUsersDto,
  UpdateUserRoleDto,
  UpdateUserStatusDto,
} from "./user.validation.js";

export class UserService {
  constructor(private readonly repository = new UserRepository()) {}

  // Get all users
  async findAll(query: GetUsersDto) {
    const { users, total } = await this.repository.findAll(query);

    return {
      users,
      pagination: {
        total,
        page: query.page,
        limit: query.limit,
        totalPages: Math.ceil(total / query.limit),
      },
    };
  }

  // Get user by id
  async findById(data: GetUserByIdDto) {
    const user = await this.repository.findById(data.id);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  // update role - user -> org, org -> user
  async updateRole(data: UpdateUserRoleDto) {
    const user = await this.repository.findById(data.id);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    // Never allow changing an ADMIN
    if (user.role === Role.ADMIN) {
      throw new BadRequestException("Cannot change admin role");
    }

    // Prevent updating to the same role
    if (user.role === data.role) {
      throw new BadRequestException(`User is already ${data.role}`);
    }

    return this.repository.updateRole(data.id, data.role);
  }
  

  // update user status - active or inactive
  async updateStatus(currentUserId: string, data: UpdateUserStatusDto) {
    const user = await this.repository.findById(data.id);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    if (currentUserId === user.id && !data.isActive) {
      throw new BadRequestException("You cannot deactivate your own account");
    }

    if (user.isActive === data.isActive) {
      throw new BadRequestException(
        data.isActive ? "User is already active" : "User is already inactive",
      );
    }

    return this.repository.updateStatusTransaction(data.id, data.isActive);
  }
}
