type ValidationRule = {
  field: string;
  type?: "string" | "array" | "boolean";
};

export type ValidationSchema = ValidationRule[];

export const createListValidationSchema: ValidationSchema = [
  { field: "name", type: "string" },
];

export const updateListValidationSchema: ValidationSchema = [
  { field: "id", type: "string" },
  { field: "name", type: "string" },
];

export const deleteListValidationSchema: ValidationSchema = [
  { field: "id", type: "string" },
];

export const reorderListsValidationSchema: ValidationSchema = [
  { field: "orderedIds", type: "array" },
];

export const createTaskValidationSchema: ValidationSchema = [
  { field: "listId", type: "string" },
  { field: "text", type: "string" },
];

export const updateTaskValidationSchema: ValidationSchema = [
  { field: "id", type: "string" },
];

export const deleteTaskValidationSchema: ValidationSchema = [
  { field: "taskId", type: "string" },
  { field: "listId", type: "string" },
];

export const reorderTasksValidationSchema: ValidationSchema = [
  { field: "listId", type: "string" },
  { field: "orderedIds", type: "array" },
];

export const toggleCompleteAllValidationSchema: ValidationSchema = [
  { field: "listId", type: "string" },
  { field: "newCompletedState", type: "boolean" },
];

export const bulkDeleteValidationSchema: ValidationSchema = [
  { field: "listId", type: "string" },
];
