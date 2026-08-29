const request = require("supertest");
const app = require("../src/app");

describe("Authentication API", () => {
  test("POST /api/auth/register should validate required fields", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({});

    expect(response.statusCode).toBe(400);

    expect(response.body).toEqual({
      success: false,
      message: "Name, email and password are required"
    });
  });

  test("POST /api/auth/login should validate required fields", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({});

    expect(response.statusCode).toBe(400);

    expect(response.body).toEqual({
      success: false,
      message: "Email and password are required"
    });
  });
});