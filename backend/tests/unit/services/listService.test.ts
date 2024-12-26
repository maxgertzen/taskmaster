import { listFactory } from "@tests/data";
import { setupServiceTest } from "@tests/helpers/serviceTestUtils";
import { ServiceTestContext } from "@tests/types/serviceTypes";

describe("ListsService", () => {
  let testContext: ServiceTestContext<"lists">;

  beforeEach(() => {
    testContext = setupServiceTest("lists");
  });

  afterEach(() => {
    testContext.container.dispose();
  });

  it("should create a new list", async () => {
    const mockList = listFactory.generateBaseList();
    testContext.repository.createList.mockResolvedValue(mockList);

    const result = await testContext.service.createList(
      mockList.userId,
      mockList.name
    );
    expect(result).toEqual(mockList);
    expect(testContext.repository.createList).toHaveBeenCalledWith(
      mockList.userId,
      mockList.name
    );
  });

  it("should retrieve lists for a user", async () => {
    const mockLists = [
      listFactory.generateBaseList(),
      listFactory.generateBaseList(),
    ];
    testContext.repository.getLists.mockResolvedValue(mockLists);

    const result = await testContext.service.getLists(mockLists[0].userId);
    expect(result).toEqual(mockLists);
    expect(testContext.repository.getLists).toHaveBeenCalledWith(
      mockLists[0].userId
    );
  });

  it("should update a list", async () => {
    const mockList = listFactory.generateBaseList();
    const updatedList = listFactory.generateBaseList({
      id: mockList.id,
      userId: mockList.userId,
      name: "Updated List Name",
    });

    testContext.repository.updateList.mockResolvedValue(updatedList);

    const result = await testContext.service.updateList(
      mockList.userId,
      mockList.id,
      updatedList.name
    );
    expect(result).toEqual(updatedList);
    expect(testContext.repository.updateList).toHaveBeenCalledWith(
      mockList.userId,
      mockList.id,
      updatedList.name
    );
  });

  it("should delete a list", async () => {
    const mockList = listFactory.generateBaseList();
    const mockResponse = { deletedId: mockList.id };

    testContext.repository.deleteList.mockResolvedValue(mockResponse);

    const result = await testContext.service.deleteList(
      mockList.userId,
      mockList.id
    );
    expect(result).toEqual(mockResponse);
    expect(testContext.repository.deleteList).toHaveBeenCalledWith(
      mockList.userId,
      mockList.id
    );
  });

  it("should reorder lists", async () => {
    const userId = "user123";
    const orderedIds = ["list1", "list2", "list3"];
    const reorderedLists = orderedIds.map((id, index) =>
      listFactory.generateBaseList({ id, userId, orderIndex: index })
    );

    testContext.repository.reorderLists.mockResolvedValue(reorderedLists);

    const result = await testContext.service.reorderLists(userId, orderedIds);
    expect(result).toEqual(reorderedLists);
    expect(testContext.repository.reorderLists).toHaveBeenCalledWith(
      userId,
      orderedIds
    );
  });
});
