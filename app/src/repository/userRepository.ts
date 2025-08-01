import { prisma } from "../utils/database";

export class UserRepository {
  findUserByFilters = async (filter) => {
    try {
      return await prisma.users.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
        where: filter,
      });
    } catch (error) {
      throw error;
    }
  };
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
      throw error;
    }
  };
  findUserByEmail = async (email: string) => {
    try {
      return await prisma.users.findUnique({
        where: { email: email },
      });
    } catch (error) {
      throw error;
    }
  };
  updateUser = async (
    id: number,
    email?: string,
    name?: string,
    role?: string
  ) => {
    try {
      return await prisma.users.update({
        where: {
          id: id,
        },
        data: {
          email: email,
          name: name,
          role: role,
        },
      });
    } catch (error) {
      throw error;
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
      throw error;
    }
  };
}
