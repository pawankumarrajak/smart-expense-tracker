const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../src/app");
const Expense = require("../src/models/Expense");

const mockUserId = new mongoose.Types.ObjectId();

jest.mock("../src/middleware/authMiddleware", () => {
  return (req, res, next) => {
    req.user = {
      userId: mockUserId
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

  test("POST /api/expenses should create an expense", async () => {
    const response = await request(app)
      .post("/api/expenses")
      .send({
        amount: 500,
        category: "food",
        description: "Lunch",
        date: "2026-08-28"
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);

    expect(response.body.data).toEqual(
      expect.objectContaining({
        amount: 500,
        category: "Food",
        description: "Lunch"
      })
    );

    const expense = await Expense.findOne({
      user: mockUserId
    });

    expect(expense).not.toBeNull();
    expect(expense.amount).toBe(500);
    expect(expense.category).toBe("Food");
  });

  test("GET /api/expenses should return user's expenses", async () => {
    await Expense.create([
      {
        user: mockUserId,
        amount: 500,
        category: "Food",
        description: "Lunch",
        date: new Date("2026-08-28")
      },
      {
        user: mockUserId,
        amount: 200,
        category: "Travel",
        description: "Bus",
        date: new Date("2026-08-27")
      }
    ]);

    const response = await request(app)
      .get("/api/expenses");

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data).toHaveLength(2);
  });

  test("PUT /api/expenses/:id should update an expense", async () => {
    const expense = await Expense.create({
      user: mockUserId,
      amount: 500,
      category: "Food",
      description: "Lunch",
      date: new Date("2026-08-28")
    });

    const response = await request(app)
      .put(`/api/expenses/${expense._id}`)
      .send({
        amount: 750,
        category: "Shopping",
        description: "New description",
        date: "2026-08-29"
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);

    expect(response.body.data).toEqual(
      expect.objectContaining({
        amount: 750,
        category: "Shopping",
        description: "New description"
      })
    );

    const updatedExpense = await Expense.findById(expense._id);

    expect(updatedExpense.amount).toBe(750);
    expect(updatedExpense.category).toBe("Shopping");
  });

  test("DELETE /api/expenses/:id should delete an expense", async () => {
    const expense = await Expense.create({
      user: mockUserId,
      amount: 500,
      category: "Food",
      description: "Lunch",
      date: new Date("2026-08-28")
    });

    const response = await request(app)
      .delete(`/api/expenses/${expense._id}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);

    const deletedExpense = await Expense.findById(expense._id);

    expect(deletedExpense).toBeNull();
  });
});