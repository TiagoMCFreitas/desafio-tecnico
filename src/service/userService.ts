import { hashSync } from "bcrypt";
import { User } from "../model/userModel";
import { UserRepository } from "./../repository/userRepository";

const userRepository = new UserRepository();
export class UserService {
  findUserByEmail = async (email: string) => {
    return await userRepository.findUserByEmail(email);
  };
  findAllUsers = async () => {
    return await userRepository.findAllUsers();
  };
  createUser = async (user: User) => {
    try {
      const existingUser = await userRepository.findUserByEmail(user.email);
      if (existingUser) {
        return {
          message: "Usuário ja existe",
          status: 400,
        };
      }

      const encryptedPassword = hashSync(user.password, 10);

      const createdUser = await userRepository.createUser(
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
