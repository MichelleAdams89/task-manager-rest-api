import request from "supertest";
import app from "../src/app.js";
import User from "../src/models/User.js";

describe("Auth Routes", () => {

  let token;

  afterEach(async () => {
    // Clean up users after each test
    await User.deleteMany({});
  });

  it("should register a user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test User",
        email: "test@example.com",
        password: "123456"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.email).toBe("test@example.com");
    expect(res.body.password).toBeUndefined();
  });

  it("should not register user with duplicate email", async () => {
    // First registration
    await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test User",
        email: "duplicate@example.com",
        password: "123456"
      });

    // Second registration with same email
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Another User",
        email: "duplicate@example.com",
        password: "123456"
      });

    expect(res.statusCode).toBe(409);
  });

  it("should login user and return token", async () => {
    // Register first
    await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test User",
        email: "test@example.com",
        password: "123456"
      });

    // Then login
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "test@example.com",
        password: "123456"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();

    token = res.body.token;
  });

  it("should not login with wrong password", async () => {
    // Register first
    await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test User",
        email: "test@example.com",
        password: "123456"
      });

    // Try login with wrong password
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "test@example.com",
        password: "wrongpassword"
      });

    expect(res.statusCode).toBe(401);
  });

});