import { CacheKey } from "@tests/types/utils";

export function generateExpectedKey(key: CacheKey, values: string[]): string {
  switch (key) {
    case "TASK":
      return `cache:user:${values[0]}:task:${values[1]}`;
    case "TASK_LIST":
      return `cache:user:${values[0]}:tasks:${values[1]}`;
    case "LIST":
      return `cache:user:${values[0]}:list:${values[1]}`;
    case "LISTS":
      return `cache:user:${values[0]}:lists`;
    case "SEARCH_RESULTS":
      return `cache:user:${values[0]}:search:${values[1]}`;
    case "USER":
      return `cache:user:${values[0]}`;
  }
}
