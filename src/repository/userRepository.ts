import { prisma } from "../utils/database";

export class UserRepository {
  findAllUsers = async () => {
    try {
      return await prisma.users.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      });
    } catch (error) {
      return error;
    }
  };
  findUserByEmail = async (email: string) => {
    try {
      return await prisma.users.findUnique({
        where: { email: email },
      });
    } catch (error) {
      return error;
    }
  };

  createUser = async (
    email: string,
    name: string,
    encryptedPassword: string,
    role: string
  ) => {
    try {
      return await prisma.users.create({
        data: {
          email: email,
          name: name,
          password: encryptedPassword,
          role: role,
        },
      });
    } catch (error) {
      return error;
    }
  };
}
