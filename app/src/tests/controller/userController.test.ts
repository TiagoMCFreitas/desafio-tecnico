import express from "express";
import request from "supertest";
import { UserService } from "../../service/userService"; // Import here to type cast the mock
import { validateInputSchemas } from "../../validate/input";

// 1. Mock dependencies FIRST, especially for classes instantiated at the module level
jest.mock("../../service/userService");
jest.mock("../../validate/input");
jest.mock("../../repository/userRepository");

// 2. Define your mock instances and mock implementations for the constructors.
// This is critical to ensure that when the controller module is imported,
// the mocked UserService and its returned instance are ready.
const mockUserServiceInstance = {
  findUsersByFilter: jest.fn(),
  updateUser: jest.fn(),
  findAllUsers: jest.fn(),
  createUser: jest.fn(),
  findUserByEmail: jest.fn(),
};

// 3. Make the mocked UserService constructor return this specific mock instance.
// This ensures that when userController does `new UserService()`, it gets our mock.
(UserService as jest.Mock).mockImplementation(() => mockUserServiceInstance);

// 4. Now, import the module under test.
// This ensures that when 'userController' module loads,
// 'new UserService()' gets your correctly configured mock instance.
import userRouter from "../../controller/userController"; // <-- Moved down

const app = express();
app.use(express.json());
app.use("/users", userRouter);

describe("userController", () => {
  beforeEach(() => {
    // Clear all mocks for a clean slate before each test
    jest.clearAllMocks();
  });

  describe("GET /users (filter)", () => {
    it("should return 400 if filter validation fails", async () => {
      (validateInputSchemas as jest.Mock).mockResolvedValue({
        error: true,
        errors: ["Invalid filter"],
      });

      const res = await request(app).get("/users?name=John");
      expect(res.status).toBe(400);
      expect(res.body).toEqual(["Invalid filter"]);
    });

    it("should return 404 if no users found", async () => {
      (validateInputSchemas as jest.Mock).mockResolvedValue({
        error: false,
        body: { name: "John" },
      });
      // Use the mockUserServiceInstance methods directly
      mockUserServiceInstance.findUsersByFilter.mockResolvedValue([]);

      const res = await request(app).get("/users?name=John");
      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: "Usuário(s) não encontrado(s)" });
    });

    it("should return 200 and users if found", async () => {
      (validateInputSchemas as jest.Mock).mockResolvedValue({
        error: false,
        body: { name: "John" },
      });
      // Use the mockUserServiceInstance methods directly
      mockUserServiceInstance.findUsersByFilter.mockResolvedValue([
        { id: 1, name: "John" },
      ]);

      const res = await request(app).get("/users?name=John");
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ users: [{ id: 1, name: "John" }] });
    });

    it("should return 500 on error", async () => {
      // This part for validateInputSchemas is correct as it's a function mock.
      (validateInputSchemas as jest.Mock).mockImplementation(() => {
        throw new Error("Unexpected error");
      });

      const res = await request(app).get("/users?name=John");
      expect(res.status).toBe(500);
      expect(res.body.status).toBe(500);
      // When an Error object is serialized to JSON by Express, it typically only includes the 'message' property.
      // So, expect res.body.message.message, not just res.body.message.
      expect(res.body.message).toEqual("Unexpected error");
    });
  });

  describe("PATCH /users/:id", () => {
    it("should return 400 if update validation fails", async () => {
      (validateInputSchemas as jest.Mock).mockResolvedValue({
        error: true,
        errors: ["Invalid update"],
      });

      const res = await request(app).patch("/users/1").send({ name: "" });
      expect(res.status).toBe(400);
      expect(res.body).toEqual(["Invalid update"]);
    });

    it("should return 200 and updated user", async () => {
      (validateInputSchemas as jest.Mock).mockResolvedValue({
        error: false,
        body: { name: "Jane" },
      });
      // Use the mockUserServiceInstance methods directly
      mockUserServiceInstance.updateUser.mockResolvedValue({
        id: 1,
        name: "Jane",
      });

      const res = await request(app).patch("/users/1").send({ name: "Jane" });
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ id: 1, name: "Jane" });
    });

    it("should return 500 on error", async () => {
      // For testing controller's error handling for validation:
      (validateInputSchemas as jest.Mock).mockImplementation(() => {
        throw new Error("Unexpected error during validation");
      });

      const res = await request(app).patch("/users/1").send({ name: "Jane" });
      expect(res.status).toBe(500);
      expect(res.body.status).toBe(500);
      expect(res.body.message).toEqual("Unexpected error during validation");
    });
  });

  // IMPORTANT NOTE: Your userController has two `userRouter.get("/")` routes.
  // Express processes routes in order. The first `GET /` route (the filter one)
  // will always be hit first, even if no query parameters are provided.
  // If you intend `GET /users` with no query to mean "find all users",
  // your first GET route's logic for `findUsersByFilter` needs to handle an empty filter object
  // by returning all users. The second `GET /` route for `findAllUsers` will never be reached
  // if the first one always matches.
  // I've adjusted the "GET /users (findAll)" test below to reflect this reality.

  describe("GET /users (findAll - via filter route with empty query)", () => {
    it("should return 200 and all users when no filter is provided", async () => {
      // Simulate no query params, so validateInputSchemas gets an empty object
      (validateInputSchemas as jest.Mock).mockResolvedValue({
        error: false,
        body: {}, // Empty body for no query params
      });

      // The controller will then call userService.findUsersByFilter({})
      mockUserServiceInstance.findUsersByFilter.mockResolvedValue([
        { id: 1, name: "John" },
        { id: 2, name: "Jane" },
      ]);

      const res = await request(app).get("/users");
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        users: [
          { id: 1, name: "John" },
          { id: 2, name: "Jane" },
        ],
      });
      // Verify findUsersByFilter was called with an empty object
      expect(mockUserServiceInstance.findUsersByFilter).toHaveBeenCalledWith(
        {}
      );
    });

    it("should return 500 on error (from findUsersByFilter or validation) when no filter is provided", async () => {
      // Simulate no query params, validation passes
      (validateInputSchemas as jest.Mock).mockResolvedValue({
        error: false,
        body: {},
      });
      // Mock findUsersByFilter to throw an error
      mockUserServiceInstance.findUsersByFilter.mockImplementation(() => {
        throw new Error("Unexpected error from service");
      });

      const res = await request(app).get("/users");
      expect(res.status).toBe(500);
      expect(res.body.status).toBe(500);
      expect(res.body.message).toEqual("Unexpected error from service");
    });
  });

  describe("POST /users", () => {
    it("should return 400 if create validation fails", async () => {
      (validateInputSchemas as jest.Mock).mockResolvedValue({
        error: true,
        errors: ["Invalid create"],
      });

      const res = await request(app).post("/users").send({ name: "" });
      expect(res.status).toBe(400);
      expect(res.body).toEqual(["Invalid create"]);
    });

    it("should return 400 if service returns error", async () => {
      (validateInputSchemas as jest.Mock).mockResolvedValue({
        error: false,
        body: { name: "John" },
      });
      // Use the mockUserServiceInstance methods directly
      mockUserServiceInstance.createUser.mockResolvedValue({
        error: true,
        message: "User already exists",
      });

      const res = await request(app).post("/users").send({ name: "John" });
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ message: "User already exists" });
    });

    it("should return 201 and created user", async () => {
      (validateInputSchemas as jest.Mock).mockResolvedValue({
        error: false,
        body: { name: "John" },
      });
      // Use the mockUserServiceInstance methods directly
      mockUserServiceInstance.createUser.mockResolvedValue({
        id: 1,
        name: "John",
      });

      const res = await request(app).post("/users").send({ name: "John" });
      expect(res.status).toBe(201);
      expect(res.body).toEqual({ id: 1, name: "John" });
    });

    it("should return 500 on error", async () => {
      // For testing controller's error handling for validation:
      (validateInputSchemas as jest.Mock).mockImplementation(() => {
        throw new Error("Unexpected error during create validation");
      });

      const res = await request(app).post("/users").send({ name: "John" });
      expect(res.status).toBe(500);
      expect(res.body.status).toBe(500);
      expect(res.body.message).toEqual(
        "Unexpected error during create validation"
      );
    });
  });
});
