import request from "supertest";
import app from "../src/app.js";
import User from "../src/models/User.js";
import Task from "../src/models/Task.js";

let token;
let taskId;
let userId;

beforeAll(async () => {
  // Clear existing data
  await User.deleteMany({});
  await Task.deleteMany({});

  // Register
  const registerRes = await request(app)
    .post("/api/auth/register")
    .send({
      name: "Task User",
      email: "task@example.com",
      password: "123456"
    });

  userId = registerRes.body._id;

  // Login
  const res = await request(app)
    .post("/api/auth/login")
    .send({
      email: "task@example.com",
      password: "123456"
    });

  token = res.body.token;
});

afterEach(async () => {
  // Clean up tasks after each test (but keep user)
  await Task.deleteMany({});
});

describe("Task Routes", () => {

  it("should not allow access without token", async () => {
    const res = await request(app)
      .get("/api/tasks");

    expect(res.statusCode).toBe(401);
  });

  it("should create a task", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Task",
        description: "Testing"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe("Test Task");
    expect(res.body.owner).toBeDefined();

    taskId = res.body._id;
  });

  it("should get user tasks only", async () => {
    // Create a task first
    const createRes = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "My Task",
        description: "My Description"
      });

    // Get tasks
    const res = await request(app)
      .get("/api/tasks")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("should delete a task", async () => {
    // Create a task first
    const createRes = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Delete Me",
        description: "To be deleted"
      });

    const taskIdToDelete = createRes.body._id;

    // Delete the task
    const deleteRes = await request(app)
      .delete(`/api/tasks/${taskIdToDelete}`)
      .set("Authorization", `Bearer ${token}`);

    expect(deleteRes.statusCode).toBe(200);

    // Verify it's deleted
    const getRes = await request(app)
      .get("/api/tasks")
      .set("Authorization", `Bearer ${token}`);

    expect(getRes.body.length).toBe(0);
  });

  it("should not allow deleting other user's task", async () => {
    // Register a second user
    const user2Res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Another User",
        email: "another@example.com",
        password: "123456"
      });

    const user2Id = user2Res.body._id;

    // Login as second user
    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({
        email: "another@example.com",
        password: "123456"
      });

    const user2Token = loginRes.body.token;

    // First user creates a task
    const createRes = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Only For User 1",
        description: "Secret task"
      });

    const taskId = createRes.body._id;

    // Second user tries to delete it
    const deleteRes = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${user2Token}`);

    expect(deleteRes.statusCode).toBe(403);
  });

});