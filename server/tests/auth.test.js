const request = require("supertest");
const bcrypt = require("bcryptjs");

const app = require("../src/app");
const User = require("../src/models/User");

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

  test("POST /api/auth/register should create a new user", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test User",
        email: "test@example.com",
        password: "password123"
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe(
      "User registered successfully"
    );

    expect(response.body.data).toEqual(
      expect.objectContaining({
        name: "Test User",
        email: "test@example.com"
      })
    );

    expect(response.body.data).not.toHaveProperty("password");

    const user = await User.findOne({
      email: "test@example.com"
    }).select("+password");

    expect(user).not.toBeNull();
    expect(user.password).not.toBe("password123");

    const passwordMatches = await bcrypt.compare(
      "password123",
      user.password
    );

    expect(passwordMatches).toBe(true);
  });

  test("POST /api/auth/register should reject duplicate email", async () => {
    await User.create({
      name: "Existing User",
      email: "existing@example.com",
      password: await bcrypt.hash("password123", 12)
    });

    const response = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Another User",
        email: "existing@example.com",
        password: "password123"
      });

    expect(response.statusCode).toBe(409);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe(
      "An account with this email already exists"
    );
  });

  test("POST /api/auth/register should reject invalid email", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test User",
        email: "invalid-email",
        password: "password123"
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe(
      "Please provide a valid email address"
    );
  });

  test("POST /api/auth/register should reject short password", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test User",
        email: "short@example.com",
        password: "1234567"
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe(
      "Password must contain at least 8 characters"
    );
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

  test("POST /api/auth/login should login with valid credentials", async () => {
    const password = "password123";

    await User.create({
      name: "Login User",
      email: "login@example.com",
      password: await bcrypt.hash(password, 12)
    });

    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: "login@example.com",
        password
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Login successful");

    expect(response.body.data.token).toEqual(
      expect.any(String)
    );

    expect(response.body.data.user).toEqual(
      expect.objectContaining({
        name: "Login User",
        email: "login@example.com"
      })
    );

    expect(response.body.data.user).not.toHaveProperty(
      "password"
    );
  });

  test("POST /api/auth/login should reject wrong password", async () => {
    await User.create({
      name: "Wrong Password User",
      email: "wrong@example.com",
      password: await bcrypt.hash("correct123", 12)
    });

    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: "wrong@example.com",
        password: "wrong123"
      });

    expect(response.statusCode).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe(
      "Invalid email or password"
    );
  });

  test("POST /api/auth/login should reject non-existent user", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: "notfound@example.com",
        password: "password123"
      });

    expect(response.statusCode).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe(
      "Invalid email or password"
    );
  });
});
