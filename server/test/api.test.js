const request = require("supertest");
const mongoose = require("mongoose");

// 🎯 FIXED: Destructure the app reference from your clean app configuration module 
const { app } = require("../app"); 

describe("🎵 Capstone Music Library REST API Test Suite", () => {
  
  // 🎯 CLEANUP HOOK: Closes the MongoDB connection loop after tests finish to avoid console hangs
  afterAll(async () => {
    if (mongoose.connection && mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      console.log("🛑 Test Runner: MongoDB Connection Closed Safely.");
    }
  });

  // ==========================================
  // 🔍 TEST 1: CORE HEALTH API GATEWAY CHECK
  // ==========================================
  it("GET / should return api health online verification", async () => {
    const res = await request(app).get("/");
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toContain("Music Library API");
  });

  // ==========================================
  // 🔍 TEST 2: ROUTE SECURITY LOCKDOWN POLICY CHECK
  // ==========================================
  it("GET /api/notifications without token should return 401 Access Denied", async () => {
    const res = await request(app).get("/api/notifications");
    
    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toContain("Access Denied");
  });

  // ==========================================
  // 🔍 TEST 3: MALFORMED URL FALLBACK ROUTE CHECK
  // ==========================================
  it("GET /api/invalid-route should fallback to 404 handler", async () => {
    const res = await request(app).get("/api/invalid-route");
    
    expect(res.statusCode).toEqual(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toEqual("Route Not Found");
  });
});