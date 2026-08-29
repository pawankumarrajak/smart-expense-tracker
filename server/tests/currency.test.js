const request = require("supertest");
const app = require("../src/app");

jest.mock("../src/services/currencyService", () => ({
  getExchangeRate: jest.fn()
}));

const {
  getExchangeRate
} = require("../src/services/currencyService");

describe("Currency API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("GET /api/currency/convert should reject missing parameters", async () => {
    const response = await request(app)
      .get("/api/currency/convert");

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe(
      "from, to and amount are required"
    );

    expect(getExchangeRate).not.toHaveBeenCalled();
  });

  test("GET /api/currency/convert should reject invalid amount", async () => {
    const response = await request(app)
      .get("/api/currency/convert")
      .query({
        from: "USD",
        to: "INR",
        amount: -100
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe(
      "Amount must be a positive number"
    );

    expect(getExchangeRate).not.toHaveBeenCalled();
  });

  test("GET /api/currency/convert should reject non-numeric amount", async () => {
    const response = await request(app)
      .get("/api/currency/convert")
      .query({
        from: "USD",
        to: "INR",
        amount: "abc"
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe(
      "Amount must be a positive number"
    );

    expect(getExchangeRate).not.toHaveBeenCalled();
  });

  test("GET /api/currency/convert should convert currency successfully", async () => {
    getExchangeRate.mockResolvedValue({
      conversion_rate: 83.25
    });

    const response = await request(app)
      .get("/api/currency/convert")
      .query({
        from: "usd",
        to: "inr",
        amount: 100
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);

    expect(response.body.data).toEqual({
      from: "USD",
      to: "INR",
      amount: 100,
      exchangeRate: 83.25,
      convertedAmount: 8325
    });

    expect(getExchangeRate).toHaveBeenCalledWith(
      "USD",
      "INR"
    );
  });

  test("GET /api/currency/convert should handle currency service error", async () => {
    const error = new Error(
      "Currency service is currently unavailable"
    );

    error.statusCode = 502;

    getExchangeRate.mockRejectedValue(error);

    const response = await request(app)
      .get("/api/currency/convert")
      .query({
        from: "USD",
        to: "INR",
        amount: 100
      });

    expect(response.statusCode).toBe(502);
    expect(response.body.success).toBe(false);
expect(response.body.message).toBe(
  "Internal server error"
);
  });
});