import { reorderArray } from "@src/utils/reorderArray";

describe("reorderArray", () => {
  it("should preserve original array", () => {
    const arr = [1, 2, 3, 4, 5];
    reorderArray(arr, 0, 4);
    expect(arr).toEqual([1, 2, 3, 4, 5]);
  });

  it("should handle same from and to indexes", () => {
    const arr = [1, 2, 3, 4, 5];
    const result = reorderArray(arr, 2, 2);
    expect(result).toEqual([1, 2, 3, 4, 5]);
  });

  it("should reorder the array", () => {
    const arr = [1, 2, 3, 4, 5];
    const result = reorderArray(arr, 2, 4);
    expect(result).toEqual([1, 2, 4, 5, 3]);
  });

  it("should handle invalid indexes", () => {
    const arr = [1, 2, 3, 4, 5];
    const result = reorderArray(arr, 2, 10);
    expect(result).toEqual(arr);
  });

  it("should handle negative indexes", () => {
    const arr = [1, 2, 3, 4, 5];
    const result = reorderArray(arr, -1, 2);
    expect(result).toEqual([1, 2, 5, 3, 4]);
  });

  it("should handle both negative indexes", () => {
    const arr = [1, 2, 3, 4, 5];
    const result = reorderArray(arr, -2, -1);
    expect(result).toEqual([1, 2, 3, 5, 4]);
  });

  it("should handle empty array", () => {
    const arr: number[] = [];
    const result = reorderArray(arr, 0, 0);
    expect(result).toEqual([]);
  });

  it("should match the expected structure snapshot", () => {
    expect(reorderArray).toMatchSnapshot();
  });
});
