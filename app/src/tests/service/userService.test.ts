import { UserService } from "../../service/userService";
import { UserRepository } from "../../repository/userRepository";
import { CreateUsersDto } from "../../dto/users/createUsers";
import { UpdateUsersDto } from "../../dto/users/updateUsers";

jest.mock("bcrypt", () => ({
    hashSync: jest.fn(() => "hashedPassword"),
}));

const mockUserRepository = {
    findUserByFilters: jest.fn(),
    updateUser: jest.fn(),
    findUserByEmail: jest.fn(),
    findAllUsers: jest.fn(),
    createUser: jest.fn(),
};

const userService = new UserService(mockUserRepository as unknown as UserRepository);

describe("UserService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("findUsersByFilter", () => {
        it("should call repository with filter and return result", async () => {
            mockUserRepository.findUserByFilters.mockResolvedValue([{ id: 1 }]);
            const result = await userService.findUsersByFilter({ name: "test" });
            expect(mockUserRepository.findUserByFilters).toHaveBeenCalledWith({ name: "test" });
            expect(result).toEqual([{ id: 1 }]);
        });
    });

    describe("updateUser", () => {
        it("should update user and return updated fields", async () => {
            const updatedUser = { email: "a@b.com", name: "Test", role: "admin" };
            mockUserRepository.updateUser.mockResolvedValue(updatedUser);
            const dto: UpdateUsersDto = { email: "a@b.com", name: "Test", role: "admin" };
            const result = await userService.updateUser(1, dto);
            expect(mockUserRepository.updateUser).toHaveBeenCalledWith(1, "a@b.com", "Test", "admin");
            expect(result).toEqual(updatedUser);
        });

        it("should return error if update fails", async () => {
            const error = new Error("Update failed");
            mockUserRepository.updateUser.mockRejectedValue(error);
            const dto: UpdateUsersDto = { email: "a@b.com", name: "Test", role: "admin" };
            const result = await userService.updateUser(1, dto);
            expect(result).toBe(error);
        });
    });

    describe("findUserByEmail", () => {
        it("should find user by email", async () => {
            mockUserRepository.findUserByEmail.mockResolvedValue({ id: 2, email: "x@y.com" });
            const result = await userService.findUserByEmail("x@y.com");
            expect(mockUserRepository.findUserByEmail).toHaveBeenCalledWith("x@y.com");
            expect(result).toEqual({ id: 2, email: "x@y.com" });
        });
    });

    describe("findAllUsers", () => {
        it("should return all users", async () => {
            mockUserRepository.findAllUsers.mockResolvedValue([{ id: 1 }, { id: 2 }]);
            const result = await userService.findAllUsers();
            expect(mockUserRepository.findAllUsers).toHaveBeenCalled();
            expect(result).toEqual([{ id: 1 }, { id: 2 }]);
        });
    });

    describe("createUser", () => {
        it("should return error if user already exists", async () => {
            mockUserRepository.findUserByEmail.mockResolvedValue({ id: 1 });
            const dto: CreateUsersDto = { email: "a@b.com", name: "Test", password: "123", role: "admin" };
            const result = await userService.createUser(dto);
            expect(result).toEqual({ message: "Usuário ja existe", error: true });
        });

        it("should create user if not exists", async () => {
            mockUserRepository.findUserByEmail.mockResolvedValue(null);
            mockUserRepository.createUser.mockResolvedValue({
                id: 3,
                email: "a@b.com",
                name: "Test",
                role: "admin",
            });
            const dto: CreateUsersDto = { email: "a@b.com", name: "Test", password: "123", role: "admin" };
            const result = await userService.createUser(dto);
            expect(mockUserRepository.createUser).toHaveBeenCalledWith(
                "a@b.com",
                "Test",
                "hashedPassword",
                "admin"
            );
            expect(result).toEqual({
                id: 3,
                email: "a@b.com",
                name: "Test",
                role: "admin",
            });
        });

        it("should return error if createUser throws", async () => {
            mockUserRepository.findUserByEmail.mockResolvedValue(null);
            const error = new Error("Create failed");
            mockUserRepository.createUser.mockRejectedValue(error);
            const dto: CreateUsersDto = { email: "a@b.com", name: "Test", password: "123", role: "admin" };
            const result = await userService.createUser(dto);
            expect(result).toBe(error);
        });
    });
});