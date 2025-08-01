import { UserRepository } from "../../repository/userRepository";
import { prisma } from "../../utils/database";

jest.mock("../../utils/database", () => ({
  prisma: {
    users: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
    },
  },
}));

describe("UserRepository", () => {
  const userRepository = new UserRepository();

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("findUserByFilters", () => {
    it("should return users filtered by criteria", async () => {
      const mockUsers = [
        { id: 1, name: "Alice", email: "alice@test.com", role: "admin" },
      ];
      (prisma.users.findMany as jest.Mock).mockResolvedValue(mockUsers);

      const result = await userRepository.findUserByFilters({ name: "Alice" });
      expect(prisma.users.findMany).toHaveBeenCalledWith({
        select: { id: true, name: true, email: true, role: true },
        where: { name: "Alice" },
      });
      expect(result).toEqual(mockUsers);
    });
  });

  describe("findAllUsers", () => {
    it("should return all users", async () => {
      const mockUsers = [
        { id: 1, name: "Alice", email: "alice@test.com", role: "admin" },
        { id: 2, name: "Bob", email: "bob@test.com", role: "user" },
      ];
      (prisma.users.findMany as jest.Mock).mockResolvedValue(mockUsers);

      const result = await userRepository.findAllUsers();
      expect(prisma.users.findMany).toHaveBeenCalledWith({
        select: { id: true, name: true, email: true, role: true },
      });
      expect(result).toEqual(mockUsers);
    });

    it("should throw error if findMany fails", async () => {
      (prisma.users.findMany as jest.Mock).mockRejectedValue(
        new Error("DB error")
      );
      await expect(userRepository.findAllUsers()).rejects.toThrow("DB error");
    });
  });

  describe("findUserByEmail", () => {
    it("should return user by email", async () => {
      const mockUser = {
        id: 1,
        name: "Alice",
        email: "alice@test.com",
        role: "admin",
        password: "hashed",
      };
      (prisma.users.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await userRepository.findUserByEmail("alice@test.com");
      expect(prisma.users.findUnique).toHaveBeenCalledWith({
        where: { email: "alice@test.com" },
      });
      expect(result).toEqual(mockUser);
    });

    it("should return null if user not found", async () => {
      (prisma.users.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await userRepository.findUserByEmail("notfound@test.com");
      expect(result).toBeNull();
    });

    it("should throw error if findUnique fails", async () => {
      (prisma.users.findUnique as jest.Mock).mockRejectedValue(
        new Error("DB error")
      );
      await expect(
        userRepository.findUserByEmail("alice@test.com")
      ).rejects.toThrow("DB error");
    });
  });

  describe("updateUser", () => {
    it("should update user fields", async () => {
      const mockUser = {
        id: 1,
        name: "Alice",
        email: "alice@test.com",
        role: "admin",
        password: "hashed",
      };
      (prisma.users.update as jest.Mock).mockResolvedValue(mockUser);

      const result = await userRepository.updateUser(
        1,
        "alice@test.com",
        "Alice",
        "admin"
      );
      expect(prisma.users.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { email: "alice@test.com", name: "Alice", role: "admin" },
      });
      expect(result).toEqual(mockUser);
    });

    it("should update only provided fields", async () => {
      const mockUser = {
        id: 1,
        name: "Bob",
        email: "bob@test.com",
        role: "user",
        password: "hashed",
      };
      (prisma.users.update as jest.Mock).mockResolvedValue(mockUser);

      await userRepository.updateUser(1, undefined, "Bob");
      expect(prisma.users.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { name: "Bob" },
      });
    });

    it("should throw error if update fails", async () => {
      (prisma.users.update as jest.Mock).mockRejectedValue(
        new Error("DB error")
      );
      await expect(
        userRepository.updateUser(1, "alice@test.com")
      ).rejects.toThrow("DB error");
    });
  });

  describe("createUser", () => {
    it("should create a new user", async () => {
      const mockUser = {
        id: 2,
        name: "Bob",
        email: "bob@test.com",
        role: "user",
        password: "hashed",
      };
      (prisma.users.create as jest.Mock).mockResolvedValue(mockUser);

      const result = await userRepository.createUser(
        "bob@test.com",
        "Bob",
        "hashed",
        "user"
      );
      expect(prisma.users.create).toHaveBeenCalledWith({
        data: {
          email: "bob@test.com",
          name: "Bob",
          password: "hashed",
          role: "user",
        },
      });
      expect(result).toEqual(mockUser);
    });

    it("should throw error if create fails", async () => {
      (prisma.users.create as jest.Mock).mockRejectedValue(
        new Error("DB error")
      );
      await expect(
        userRepository.createUser("bob@test.com", "Bob", "hashed", "user")
      ).rejects.toThrow("DB error");
    });
  });
});
