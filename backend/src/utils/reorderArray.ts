export const reorderArray = <T>(
  array: T[],
  fromIndex: number,
  toIndex: number
): T[] => {
  if (!array.length) return [];

  const arr = [...array];

  const normalizedFromIndex =
    fromIndex < 0 ? array.length + fromIndex : fromIndex;
  const normalizedToIndex = toIndex < 0 ? array.length + toIndex : toIndex;

  if (
    normalizedFromIndex < 0 ||
    normalizedFromIndex >= array.length ||
    normalizedToIndex < 0 ||
    normalizedToIndex >= array.length
  ) {
    return arr;
  }

  const [movedItem] = arr.splice(normalizedFromIndex, 1);
  arr.splice(normalizedToIndex, 0, movedItem);

  return arr;
};
