import request from "supertest";
import { app } from "..";
import { expect, describe, beforeAll, afterAll, it } from "vitest";
import { firebaseAdmin } from "../services/firebase";
import { getValidFirebaseIdToken } from "./auth-helper";
import { prisma } from "../services/prisma";

let jwtToken: string;

describe("E2E tests for Sierra API", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await prisma.link.deleteMany();
    await prisma.user.deleteMany();
    await app.close();
  });

  it("GET / should return health check", async () => {
    const res = await request(app.server).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ status: "API is running 🚀" });
  });

  it("POST /auth/firebase - invalid token returns 401", async () => {
    const res = await request(app.server)
      .post("/auth/firebase")
      .send({ idToken: "invalid.token" });
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("error");
  });

  it("POST /auth/firebase - valid token logs in user and returns JWT", async () => {
    const idToken = await getValidFirebaseIdToken();
    const res = await request(app.server)
      .post("/auth/firebase")
      .send({ idToken });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body).toHaveProperty("user");
    jwtToken = res.body.token;
  });

  describe("Link routes", () => {
    let createdLinkId1: string;
    let createdLinkId2: string;
    it("GET /links should return an empty array initially", async () => {
      const res = await request(app.server)
        .get("/links")
        .set("Authorization", `Bearer ${jwtToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual([]);
    });

    it("POST /links should create a new link", async () => {
      const res = await request(app.server)
        .post("/links")
        .set("Authorization", `Bearer ${jwtToken}`)
        .send({ title: "My Site", url: "https://example.com" });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("id");
      expect(res.body.title).toBe("My Site");

      createdLinkId1 = res.body.id;
    });
    it("POST /links should create another link", async () => {
      const res = await request(app.server)
        .post("/links")
        .set("Authorization", `Bearer ${jwtToken}`)
        .send({ title: "My Blog", url: "https://blog.example.com" });

      expect(res.statusCode).toBe(200);
      createdLinkId2 = res.body.id;
    });

    it("PUT /links/:id should update a link", async () => {
      const res = await request(app.server)
        .put(`/links/${createdLinkId1}`)
        .set("Authorization", `Bearer ${jwtToken}`)
        .send({ title: "Updated Title", url: "https://newurl.com" });

      expect(res.statusCode).toBe(200);
      expect(res.body.title).toBe("Updated Title");
    });

    it("PATCH /links/reorder should reorder the links", async () => {
      const res = await request(app.server)
        .patch("/links/reorder")
        .set("Authorization", `Bearer ${jwtToken}`)
        .send({ linkIds: [createdLinkId2, createdLinkId1] });

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ success: true });

      const reordered = await prisma.link.findMany({
        orderBy: { order: "asc" },
      });

      expect(reordered[0].id).toBe(createdLinkId2);
      expect(reordered[1].id).toBe(createdLinkId1);
    });

    it("DELETE /links/:id should delete a link", async () => {
      const res = await request(app.server)
        .delete(`/links/${createdLinkId1}`)
        .set("Authorization", `Bearer ${jwtToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ success: true });
    });
  });

  describe("Profile routes", () => {
    it("GET /profile/:username should return a user's profile", async () => {
      const username = process.env.FIREBASE_USER_EMAIL?.split("@")[0];
      const res = await request(app.server).get(`/profile/${username}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("username");
      expect(res.body).toHaveProperty("userPhoto");
      expect(res.body).toHaveProperty("links");
    });
  });
});
