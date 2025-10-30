import axios from "axios";
import { beforeAll, describe, expect, it } from "bun:test";
import { createUser } from "./testUtils";

let BASE_URL = "http://localhost:3000";

describe("Website gets created", () => {
  let token: string;

  beforeAll(async () => {
    const data = await createUser();
    token = data.jwt;
    console.log("Token received:", token);
  });

  it("Website not created if url is not present", async () => {
    try {
      await axios.post(
        `${BASE_URL}/api/v1/website`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      expect(false).toBe(true); // Should not reach here
    } catch (e) {}
  });
  it("Website created if url is present", async () => {
    console.log("Using token:", token);
    const response = await axios.post(
      `${BASE_URL}/api/v1/website`,
      {
        url: "https://google.com",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    expect(response.data.id).toBeDefined();
  });

  it("Website is not created if header is not present", async () => {
    try {
      const response = await axios.post(`${BASE_URL}/api/v1/website`, {
        url: "https://google.com",
      });
      expect(false, "website should not created if header is not present").toBe(
        true
      );
    } catch (e) {
      expect(true).toBe(true); // Should throw error without auth
    }
  });
});

describe("Can fetch website", () => {
  let token1: string, user_id1: string;
  let token2: string, user_id2: string;

  beforeAll(async () => {
    const user1 = await createUser();
    const user2 = await createUser();
    token1 = user1.jwt;
    user_id1 = user1.id;
    token2 = user2.jwt;
    user_id2 = user2.id;
  });

  it("Is able to fetch a website that the user created", async () => {
    const websiteResponse = await axios.post(
      `${BASE_URL}/api/v1/website`,
      {
        url: "https://google.com",
      },
      {
        headers: {
          Authorization: `Bearer ${token1}`,
        },
      }
    );

    const getWebsiteResponse = await axios.get(
      `${BASE_URL}/api/v1/website/status/${websiteResponse.data.id}`,
      {
        headers: {
          Authorization: `Bearer ${token1}`,
        },
      }
    );

    expect(getWebsiteResponse.data.id).toBe(websiteResponse.data.id);
    expect(getWebsiteResponse.data.url).toBe("https://google.com");
  });

  it("Can not access website created by user to other user", async () => {
    const websiteResponse = await axios.post(
      `${BASE_URL}/api/v1/website`,
      {
        url: "https://google.com",
      },
      {
        headers: {
          Authorization: `Bearer ${token1}`,
        },
      }
    );
    try {
      const getWebsiteResponse = await axios.get(
        `${BASE_URL}/api/v1/website/status/${websiteResponse.data.id}`,
        {
          headers: {
            Authorization: `Bearer ${token2}`,
          },
        }
      );
      expect(false, "should not be able to access website by different user").toBe(true);
    } catch (e) {
      expect(true).toBe(true); // Should fail with different user
    }
  });
});
