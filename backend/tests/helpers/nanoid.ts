export const mockNanoid = () => {
  jest.mock("nanoid", () => ({
    nanoid: jest.fn(() => "mocked-id"),
  }));
};
