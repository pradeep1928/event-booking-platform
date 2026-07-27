import { UserRepository } from "./user.repository.js";
import { GetUsersDto } from "./user.validation.js";

export class UserService {
  constructor(private readonly repository = new UserRepository()) {}

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
}
