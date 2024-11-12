export const reorderArray = <T>(
  array: T[],
  fromIndex: number,
  toIndex: number
): T[] => {
  const arr = [...array];
  const [movedItem] = arr.splice(fromIndex, 1);
  arr.splice(toIndex, 0, movedItem);
  return arr;
};
