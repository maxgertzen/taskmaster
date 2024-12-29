const containerModule = jest.requireActual("@src/container");
jest
  .spyOn(containerModule, "getAppContainer")
  .mockImplementation(() => global.testContainer);

import { makeTestRequest } from "./setup/testSetup";
import type { ListsCache } from "@src/services/cache";
import {
  CreateListResponse,
  DeleteListResponse,
  GetListsResponse,
  ReorderListsResponse,
  UpdateListResponse,
} from "@src/types/responses";
import { listFactory } from "@tests/data";
import { MOCK_USER_ID } from "@src/mocks/constants";

describe("Lists API Integration Tests", () => {
  let request: ReturnType<typeof makeTestRequest>;
  let listsCache: ListsCache;
  let testUserObjectId: string;
  const testUserId = MOCK_USER_ID;

  beforeEach(async () => {
    const container = global.testContainer;
    listsCache = container.cradle.listsCache;
    const testUser = await container.cradle.userRepository.createUser(
      testUserId
    );
    testUserObjectId =
      "_id" in testUser
        ? testUser._id?.toString() || testUser.auth0Id
        : testUser.auth0Id;
    request = makeTestRequest();
  });

  describe("POST /api/lists", () => {
    it("should create a new list and invalidate cache", async () => {
      // Arrange
      const newList = { name: "Test List" };

      // Act
      const response = await request
        .post("/api/lists")
        .send(newList)
        .expect(200);

      const result = response.body as CreateListResponse;

      // Assert
      expect(result).toMatchObject<CreateListResponse>({
        id: expect.any(String),
        name: newList.name,
        userId: expect.any(String),
        creationDate: expect.any(String),
        orderIndex: expect.any(Number),
      });

      // Verify cache was invalidated
      const cachedLists = await listsCache.getLists(testUserObjectId);
      expect(cachedLists).toBeNull();
    });

    it("should reject invalid list creation request", async () => {
      await request.post("/api/lists").send({}).expect(400);
    });
  });

  describe("GET /api/lists", () => {
    it("should return cached lists if available", async () => {
      // Arrange
      const mockLists = [
        listFactory.generateBaseList({ userId: testUserId, orderIndex: 0 }),
        listFactory.generateBaseList({ userId: testUserId, orderIndex: 1 }),
      ];
      await listsCache.setLists(testUserObjectId, mockLists);

      // Act
      const response = await request.get("/api/lists").expect(200);

      const result = response.body as GetListsResponse;

      // Assert
      expect(result).toMatchObject<GetListsResponse>([...mockLists]);
    });

    it("should fetch from repository and cache if not cached", async () => {
      // Arrange
      await request.post("/api/lists").send({ name: "Test List 1" });

      // Act
      const response = await request.get("/api/lists").expect(200);

      const result = response.body as GetListsResponse;

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Test List 1");

      // Verify results were cached
      const cachedLists = await listsCache.getLists(testUserObjectId);
      expect(cachedLists).toEqual(result);
    });
  });

  describe("PUT /api/lists", () => {
    it("should update list and invalidate cache", async () => {
      // Arrange
      const createResponse = await request
        .post("/api/lists")
        .send({ name: "Original Name" });

      const listId = createResponse.body.id;
      const updateData = { id: listId, name: "Updated Name" };

      // Act
      const response = await request
        .put("/api/lists")
        .send(updateData)
        .expect(200);

      const result = response.body as UpdateListResponse;

      // Assert
      expect(result).toMatchObject<UpdateListResponse>({
        id: listId,
        name: "Updated Name",
        userId: expect.stringMatching(
          new RegExp(`^(${testUserId}|${testUserObjectId})$`)
        ),
        creationDate: expect.any(String),
        orderIndex: expect.any(Number),
      });

      // Verify cache was invalidated
      const cachedLists = await listsCache.getLists(testUserObjectId);
      expect(cachedLists).toBeNull();
    });

    it("should reject invalid update request", async () => {
      await request
        .put("/api/lists")
        .send({ name: "New Name" }) // Missing id
        .expect(400);
    });
  });

  describe("DELETE /api/lists", () => {
    it("should delete list and invalidate cache", async () => {
      // Arrange
      const createResponse = await request
        .post("/api/lists")
        .send({ name: "To Be Deleted" });

      const listId = createResponse.body.id;

      // Act
      const response = await request
        .delete("/api/lists")
        .send({ id: listId })
        .expect(200);

      const result = response.body as DeleteListResponse;

      // Assert
      expect(result).toEqual({ deletedId: listId });

      // Verify list was deleted
      const lists = await request.get("/api/lists");
      expect(lists.body).not.toContainEqual(
        expect.objectContaining({ id: listId })
      );

      // Verify cache was invalidated
      const cachedLists = await listsCache.getLists(testUserObjectId);
      expect(cachedLists).toBeNull();
    });
  });

  describe("POST /api/lists/reorder", () => {
    it("should reorder lists and update cache", async () => {
      // Arrange
      const list1 = await request.post("/api/lists").send({ name: "List 1" });

      const list2 = await request.post("/api/lists").send({ name: "List 2" });

      const orderedIds = [list2.body.id, list1.body.id]; // Reverse order

      // Act
      const response = await request
        .post("/api/lists/reorder")
        .send({ orderedIds })
        .expect(200);

      const result = response.body as ReorderListsResponse;

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(list2.body.id); // First item should be list2
      expect(result[1].id).toBe(list1.body.id); // Second item should be list1

      // Verify cache was updated
      const cachedLists = await listsCache.getLists(testUserObjectId);
      expect(cachedLists).toEqual(result);
    });

    it("should reject reorder request with invalid ids", async () => {
      await request
        .post("/api/lists/reorder")
        .send({ orderedIds: ["invalid-id"] })
        .expect(500);
    });
  });

  // TODO: Implement test
  // Remove userId to simulate unauthorized request
  describe.skip("Error handling", () => {
    it("should handle unauthorized requests", async () => {
      request = makeTestRequest();

      await request.get("/api/lists").set({ authorization: "" }).expect(401);
    });

    it("should handle non-existent list operations", async () => {
      await request
        .put("/api/lists")
        .send({ id: "non-existent-id", name: "New Name" })
        .expect(500);
    });
  });
});
