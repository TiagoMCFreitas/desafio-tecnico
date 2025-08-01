import express from "express";
import request from "supertest";
// Import CryptoCurrencyService here for type information, but it will be mocked.
import { CryptoCurrencyService } from "../../service/cryptoCurrencyService";
// validateInputSchemas is already correctly mocked.
import { validateInputSchemas } from "../../validate/input";

// --- IMPORTANT: Place all Jest mocks BEFORE importing the module under test ---
jest.mock("../../service/cryptoCurrencyService");
// Assuming cryptoCurrencyRepository is also a dependency of CryptoCurrencyService, mock it too.
jest.mock("../../repository/cryptoCurrencyRepository");
jest.mock("../../validate/input", () => ({
  validateInputSchemas: jest.fn(),
}));

// --- START: FIX FOR CLASS MOCKING ---
// 1. Create a mock instance with all methods that the controller will call
const mockCryptoCurrencyServiceInstance = {
  orderCryptos: jest.fn(),
  findCryptos: jest.fn(),
  // Add any other methods from CryptoCurrencyService that the controller might use (e.g., create, update, delete)
};

// 2. Make the mocked CryptoCurrencyService constructor return this specific mock instance.
// This ensures that when cryptoCurrencyController does `new CryptoCurrencyService()`, it gets our mock.
(CryptoCurrencyService as jest.Mock).mockImplementation(
  () => mockCryptoCurrencyServiceInstance
);
// --- END: FIX FOR CLASS MOCKING ---

// Now, import the controller after all its dependencies are mocked and configured.
import cryptoCurrencyRouter from "../../controller/cryptoCurrencyController"; // Moved down

const app = express();
app.use(express.json());
app.use("/crypto", cryptoCurrencyRouter);

describe("cryptoCurrencyController", () => {
  beforeEach(() => {
    // Clear all mocks for a clean slate before each test
    jest.clearAllMocks();
  });

  describe("GET /crypto/order/", () => {
    it("should return 200 and ordered cryptos when input is valid", async () => {
      (validateInputSchemas as jest.Mock).mockResolvedValue({
        error: false,
        body: { id: "asc", currentPrice: "asc" },
      });
      // Use the mock instance method directly
      mockCryptoCurrencyServiceInstance.orderCryptos.mockResolvedValue([
        { id: 1, name: "BTC" },
      ]);

      const res = await request(app).get(
        "/crypto/order/?id=asc&currentPrice=asc"
      );
      expect(res.status).toBe(200);
      expect(res.body).toEqual([{ id: 1, name: "BTC" }]);
      expect(validateInputSchemas).toHaveBeenCalledWith(expect.any(Object), {
        id: "asc",
        currentPrice: "asc",
      }); // More specific check
      // Verify the mock instance method was called with the correct arguments
      expect(
        mockCryptoCurrencyServiceInstance.orderCryptos
      ).toHaveBeenCalledWith({ id: "asc", currentPrice: "asc" });
    });

    it("should return 400 if validation fails", async () => {
      (validateInputSchemas as jest.Mock).mockResolvedValue({
        error: true,
        errors: ["Invalid params"],
      });

      const res = await request(app).get("/crypto/order/?sortBy=invalid");
      expect(res.status).toBe(400);
      expect(res.body).toEqual(["Invalid params"]);
      expect(validateInputSchemas).toHaveBeenCalled();
    });

    it("should return 500 if service throws", async () => {
      (validateInputSchemas as jest.Mock).mockResolvedValue({
        error: false,
        body: { sortBy: "price", order: "asc" },
      });
      // Use the mock instance method directly
      mockCryptoCurrencyServiceInstance.orderCryptos.mockRejectedValue(
        new Error("Service error")
      );

      const res = await request(app).get(
        "/crypto/order/?sortBy=price&order=asc"
      );
      expect(res.status).toBe(500);
      // Assuming the controller's catch block formats the error message as { status: 500, message: error.message }
      expect(res.body).toEqual({
        status: 500,
        message: "Service error",
      });
      expect(validateInputSchemas).toHaveBeenCalled();
      expect(mockCryptoCurrencyServiceInstance.orderCryptos).toHaveBeenCalled();
    });
  });

  describe("GET /crypto/", () => {
    it("should return 200 and filtered cryptos when input is valid", async () => {
      (validateInputSchemas as jest.Mock).mockResolvedValue({
        error: false,
        body: { name: "BTC" },
      });
      // Use the mock instance method directly
      mockCryptoCurrencyServiceInstance.findCryptos.mockResolvedValue([
        { id: 1, name: "BTC" },
      ]);

      const res = await request(app).get("/crypto/?name=BTC");
      expect(res.status).toBe(200);
      expect(res.body).toEqual([{ id: 1, name: "BTC" }]);
      expect(validateInputSchemas).toHaveBeenCalledWith(expect.any(Object), {
        name: "BTC",
      }); // More specific check
      // Verify the mock instance method was called with the correct arguments
      expect(
        mockCryptoCurrencyServiceInstance.findCryptos
      ).toHaveBeenCalledWith({
        name: "BTC",
      });
    });

    it("should return 400 if validation fails", async () => {
      (validateInputSchemas as jest.Mock).mockResolvedValue({
        error: true,
        errors: ["Invalid filter"],
      });

      const res = await request(app).get("/crypto/?name=");
      expect(res.status).toBe(400);
      expect(res.body).toEqual(["Invalid filter"]);
      expect(validateInputSchemas).toHaveBeenCalled();
    });

    it("should return 500 if service throws", async () => {
      (validateInputSchemas as jest.Mock).mockResolvedValue({
        error: false,
        body: { name: "BTC" },
      });
      // Use the mock instance method directly
      mockCryptoCurrencyServiceInstance.findCryptos.mockRejectedValue(
        new Error("Find error")
      );

      const res = await request(app).get("/crypto/?name=BTC");
      expect(res.status).toBe(500);
      // Assuming the controller's catch block formats the error message as { status: 500, message: error.message }
      expect(res.body).toEqual({
        status: 500,
        message: "Find error",
      });
      expect(validateInputSchemas).toHaveBeenCalled();
      expect(mockCryptoCurrencyServiceInstance.findCryptos).toHaveBeenCalled();
    });
  });
});
