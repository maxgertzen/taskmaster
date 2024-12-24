import { IListRepository } from "@interfaces/listRepository";
import { ListsService } from "@src/services/listsService";
import { listFactory } from "@tests/data";

describe("ListsService", () => {
  let listService: ListsService;
  let mockListRepository: jest.Mocked<IListRepository>;

  beforeEach(() => {
    mockListRepository = {
      createList: jest.fn(),
      getLists: jest.fn(),
      updateList: jest.fn(),
      deleteList: jest.fn(),
      reorderLists: jest.fn(),
    };
    listService = new ListsService(mockListRepository);
  });

  it("should create a new list", async () => {
    const mockList = listFactory.generateBaseList();
    mockListRepository.createList.mockResolvedValue(mockList);

    const result = await listService.createList(mockList.userId, mockList.name);
    expect(result).toEqual(mockList);
    expect(mockListRepository.createList).toHaveBeenCalledWith(
      mockList.userId,
      mockList.name
    );
  });

  it("should retrieve lists for a user", async () => {
    const mockLists = [
      listFactory.generateBaseList(),
      listFactory.generateBaseList(),
    ];
    mockListRepository.getLists.mockResolvedValue(mockLists);

    const result = await listService.getLists(mockLists[0].userId);
    expect(result).toEqual(mockLists);
    expect(mockListRepository.getLists).toHaveBeenCalledWith(
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

    mockListRepository.updateList.mockResolvedValue(updatedList);

    const result = await listService.updateList(
      mockList.userId,
      mockList.id,
      updatedList.name
    );
    expect(result).toEqual(updatedList);
    expect(mockListRepository.updateList).toHaveBeenCalledWith(
      mockList.userId,
      mockList.id,
      updatedList.name
    );
  });

  it("should delete a list", async () => {
    const mockList = listFactory.generateBaseList();
    const mockResponse = { deletedId: mockList.id };

    mockListRepository.deleteList.mockResolvedValue(mockResponse);

    const result = await listService.deleteList(mockList.userId, mockList.id);
    expect(result).toEqual(mockResponse);
    expect(mockListRepository.deleteList).toHaveBeenCalledWith(
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

    mockListRepository.reorderLists.mockResolvedValue(reorderedLists);

    const result = await listService.reorderLists(userId, orderedIds);
    expect(result).toEqual(reorderedLists);
    expect(mockListRepository.reorderLists).toHaveBeenCalledWith(
      userId,
      orderedIds
    );
  });
});
