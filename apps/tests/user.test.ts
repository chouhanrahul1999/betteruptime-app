import axios from "axios";
import { describe, it, expect, test } from "bun:test";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

describe("Signup endpoint", () => {
  it("Is not able to signup if body is incorrect", async () => {
    try {
      await axios.post(`${BASE_URL}/api/v1/user/signup`, {
        username: "ab", // Too short
        password: "Rahul@123",
      });
      expect(false, "control should not reach here");
    } catch (e) {
      expect(true); // Should fail validation
    }
  });

   it("Is able to signup if body is correct", async () => {
    const uniqueUsername = `user${Date.now()}@test.com`;
    try {
      const response = await axios.post(`${BASE_URL}/api/v1/user/signup`, {
        username: uniqueUsername,
        password: "Rahul@123",
      });
      expect(response.status).toBe(200);
      expect(response.data.id).toBeDefined();
    } catch (e: any) {
      console.error(e.response?.data || e.message);
      throw e;
    }
  });
});

describe("Signin endpoint", () => {
  const testUsername = `signin${Date.now()}@test.com`;
  
  it("Should create user for signin tests", async () => {
    const response = await axios.post(`${BASE_URL}/api/v1/user/signup`, {
      username: testUsername,
      password: "Rahul@123",
    });
    expect(response.status).toBe(200);
  });
  
  it("Is not able to signin if body is incorrect", async () => {
    try {
      await axios.post(`${BASE_URL}/api/v1/user/signin`, {
        username: testUsername,
        password: "wrongpassword",
      });
      expect(false, "control should not reach here");
    } catch (e) {
      expect(true); // Should fail with wrong password
    }
  });

  it("Is able to signin if body is correct", async () => {
    const res = await axios.post(`${BASE_URL}/api/v1/user/signin`, {
      username: testUsername,
      password: "Rahul@123",
    });
    expect(res.status).toBe(200);
    expect(res.data.token).toBeDefined();
  });
});
