import request from "supertest";
import app from "../src/app.js";
import User from "../src/models/User.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const testSuite = !global.isMongoConnected ? describe.skip : describe;

testSuite("Auth Routes", () => {

  let token;

  beforeAll(async () => {
    // Try to connect to MongoDB
    try {
      const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/taskmanager_test";
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 5000,
        connectTimeoutMS: 5000,
      });
      console.log("✓ Test database connected");
      global.isMongoConnected = true;
    } catch (error) {
      console.warn("⚠ MongoDB connection failed - running tests without database");
      console.warn("To fix: Install MongoDB locally or update MONGO_URI in .env file");
      console.warn("Error:", error.message);
      global.isMongoConnected = false;
    }
  });

  afterAll(async () => {
    // Clean up
    try {
      if (mongoose.connection.readyState === 1) {
        await User.deleteMany({});
        await mongoose.disconnect();
        console.log("✓ Test database disconnected");
      }
    } catch (error) {
      console.error("Error cleaning up test database:", error.message);
    }
  });

  afterEach(async () => {
    // Clean up users after each test
    if (global.isMongoConnected) {
      await User.deleteMany({});
    }
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