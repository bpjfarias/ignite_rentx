import ICreateUserDTO from "@modules/accounts/dtos/ICreateUserDTO";
import User from "@modules/accounts/infra/typeorm/entities/User";
import IUsersRepository from "@modules/accounts/repositories/IUsersRepository";
import { hash } from "bcryptjs";
import { inject, injectable } from "tsyringe";

import AppError from "@shared/errors/AppError";

@injectable()
export default class CreateUserUseCase {
  private repository: IUsersRepository;

  constructor(@inject("UserRepositoryImpl") userRepository: IUsersRepository) {
    this.repository = userRepository;
  }
  async execute(user: ICreateUserDTO): Promise<User> {
    const exists = await this.repository.findByEmail(user.email);

    if (exists) {
      throw new AppError("User already exists.");
    } else {
      const hashPW = await hash(user.password, 8);
      // eslint-disable-next-line no-param-reassign
      user.password = hashPW;
      const created = await this.repository.create(user);
      return created;
    }
  }
}
