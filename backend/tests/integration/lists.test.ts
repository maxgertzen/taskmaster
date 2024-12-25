import { makeRequest } from "@tests/integration/setup/testServer";

import { listFactory } from "@tests/data/listFactory";
import { getTestCacheClient, teardownTestDatabase } from "./setup/database";
import { generateObjectId } from "@tests/helpers/generateObjectId";
import { envManager } from "@tests/helpers/envManager";
import { CacheService } from "@src/services/cache/cacheService";
import { CACHE_KEYS } from "@src/utils/cacheKeys";

describe("Integration Tests for /api/lists", () => {
  let cacheService: CacheService;

  beforeEach(() => {
    envManager.setEnv("mock");
    cacheService = new CacheService(getTestCacheClient());
  });
  describe("GET /api/lists", () => {
    it("should return an empty array when no lists exist", async () => {
      const response = await makeRequest().get("/api/lists");
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it("should return all existing lists", async () => {
      const lists = [
        listFactory.generateBaseList({ name: "Groceries" }),
        listFactory.generateBaseList({ name: "Work Tasks" }),
      ];

      await Promise.all(
        lists.map((list) => makeRequest().post("/api/lists").send(list))
      );

      const response = await makeRequest().get("/api/lists");
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: "Groceries" }),
          expect.objectContaining({ name: "Work Tasks" }),
        ])
      );
    });
  });

  describe("POST /api/lists", () => {
    it("should create a new list", async () => {
      const listData = listFactory.generateBaseList({ name: "New List" });

      const response = await makeRequest().post("/api/lists").send(listData);
      expect(response.status).toBe(201);
      expect(response.body).toEqual(
        expect.objectContaining({ name: "New List" })
      );

      const cachedLists = JSON.parse(
        (await cacheService.get(CACHE_KEYS.LISTS(listData.userId))) || "[]"
      );
      expect(cachedLists).toEqual(
        expect.arrayContaining([expect.objectContaining({ name: "New List" })])
      );
    });

    it("should return a validation error for missing fields", async () => {
      const response = await makeRequest().post("/api/lists").send({});
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toBe(
        "Validation failed: Missing required fields"
      );
    });
  });

  describe("POST /api/lists/reorder", () => {
    it("should reorder lists successfully", async () => {
      const lists = [
        listFactory.generateBaseList({ name: "Groceries" }),
        listFactory.generateBaseList({ name: "Work Tasks" }),
      ];

      await Promise.all(
        lists.map((list) => makeRequest().post("/api/lists").send(list))
      );

      const reorderData = { order: [1, 0] };
      const response = await makeRequest()
        .post("/api/lists/reorder")
        .send(reorderData);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Lists reordered successfully");
    });
  });

  describe("PUT /api/lists", () => {
    it("should update an existing list", async () => {
      const listData = listFactory.generateBaseList({ name: "Initial List" });
      const createdList = await makeRequest().post("/api/lists").send(listData);

      const updatedData = listFactory.generateBaseList({
        name: "Updated List",
        id: createdList.body.id,
      });
      const response = await makeRequest()
        .put("/api/lists")
        .send({ ...updatedData });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.objectContaining(updatedData));
    });

    it("should return 404 for a non-existent ID", async () => {
      const response = await makeRequest()
        .put("/api/lists")
        .send({ id: generateObjectId(), name: "Updated List" });

      expect(response.status).toBe(404);
    });
  });

  describe("DELETE /api/lists", () => {
    it("should delete an existing list", async () => {
      const listData = listFactory.generateBaseList({ name: "List to Delete" });
      const createdList = await makeRequest().post("/api/lists").send(listData);

      const response = await makeRequest()
        .delete("/api/lists")
        .send({ id: createdList.body._id });
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("List successfully deleted");

      const cacheClient = getTestCacheClient();
      const cachedLists = JSON.parse((await cacheClient.get("lists")) || "[]");
      expect(cachedLists).not.toContainEqual(
        expect.objectContaining({ name: "List to Delete" })
      );

      const getResponse = await makeRequest().get("/api/lists");
      expect(getResponse.body.length).toBe(0);
    });

    it("should return 404 for a non-existent ID", async () => {
      const response = await makeRequest()
        .delete("/api/lists")
        .send({ id: generateObjectId() });
      expect(response.status).toBe(404);
    });
  });

  describe("Middleware Integration", () => {
    it("should return 401 if the user is not authenticated", async () => {
      const response = await makeRequest().get("/api/lists");
      expect(response.status).toBe(401);
      expect(response.body.error).toBe("Unauthorized");
    });
  });

  describe("Error Handling", () => {
    it("should return 500 if the database is down", async () => {
      await teardownTestDatabase();
      const response = await makeRequest()
        .post("/api/lists")
        .send(listFactory.generateBaseList({ name: "Test List" }));
      expect(response.status).toBe(500);
      expect(response.body.error).toBe("Internal Server Error");
    });
  });
});
