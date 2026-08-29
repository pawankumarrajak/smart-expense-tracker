const request = require("supertest");
const app = require("../src/app");

jest.mock("../src/middleware/authMiddleware", () => {
  return (req, res, next) => {
    req.user = {
      userId: "507f1f77bcf86cd799439011"
    };
    next();
  };
});

describe("Expense API", () => {
  test("POST /api/expenses should reject missing amount", async () => {
    const response = await request(app)
      .post("/api/expenses")
      .send({
        category: "Food",
        date: "2026-08-28"
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Amount is required");
  });

  test("POST /api/expenses should reject invalid amount", async () => {
    const response = await request(app)
      .post("/api/expenses")
      .send({
        amount: -100,
        category: "Food",
        date: "2026-08-28"
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe(
      "Amount must be a positive number"
    );
  });

  test("POST /api/expenses should reject invalid category", async () => {
    const response = await request(app)
      .post("/api/expenses")
      .send({
        amount: 500,
        category: "A",
        date: "2026-08-28"
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe(
      "Category must contain at least 2 characters"
    );
  });

  test("POST /api/expenses should reject missing date", async () => {
    const response = await request(app)
      .post("/api/expenses")
      .send({
        amount: 500,
        category: "Food"
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe(
      "A valid date is required"
    );
  });
});
