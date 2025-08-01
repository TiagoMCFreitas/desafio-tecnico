import { hashSync } from "bcrypt";

import { CreateUsersDto } from "../dto/users/createUsers";
import { UpdateUsersDto } from "../dto/users/updateUsers";
import { UserRepository } from "../repository/userRepository";

export class UserService {
  constructor(private userRepository: UserRepository) {}

  findUsersByFilter = async (filter) => {
    return await this.userRepository.findUserByFilters(filter);
  };
  updateUser = async (id: number, user: UpdateUsersDto) => {
    try {
      const updatedUser = await this.userRepository.updateUser(
        id,
        user.email,
        user.name,
        user.role
      );

      return {
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role,
      };
    } catch (error) {
      return error;
    }
  };
  findUserByEmail = async (email: string) => {
    return await this.userRepository.findUserByEmail(email);
  };

  findAllUsers = async () => {
    return await this.userRepository.findAllUsers();
  };

  createUser = async (user: CreateUsersDto) => {
    try {
      const existingUser = await this.userRepository.findUserByEmail(
        user.email
      );
      if (existingUser) {
        return {
          message: "Usuário ja existe",
          error: true,
        };
      }

      const encryptedPassword = hashSync(user.password, 10);

      const createdUser = await this.userRepository.createUser(
        user.email,
        user.name,
        encryptedPassword,
        user.role
      );

      return {
        id: createdUser.id,
        email: createdUser.email,
        name: createdUser.name,
        role: createdUser.role,
      };
    } catch (err) {
      return err;
    }
  };
}
