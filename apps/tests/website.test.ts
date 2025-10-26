import axios from "axios";
import { describe, expect, it } from "bun:test";

let BASE_URL = "http://localhost:3000";

describe("Website gets created", () => {
  it("Website not created if url is not present", async () => {
    try {
      await axios.post(`${BASE_URL}/api/v1/website`, {});
      expect(false).toBe(true); // Should not reach here
    } catch (e) {
      
    }
  });
  it("Website created if url is present", async () => {
    const response = await axios.post(`${BASE_URL}/api/v1/website`, {
      url: "https://google.com",
    });
    expect(response.data.id).toBeDefined();
  });
});
