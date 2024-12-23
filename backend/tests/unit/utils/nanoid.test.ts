import { generateUniqueId } from "@src/utils/nanoid";
import { utilTestConfigs } from "@tests/data/utils";

const { mockResponses } = utilTestConfigs;

jest.mock("nanoid", () => ({
  nanoid: jest.fn(() => mockResponses.nanoid.default),
}));

describe("Nanoid", () => {
  describe("generateUniqueId", () => {
    it("should return a unique id using nanoid", async () => {
      const result = await generateUniqueId();
      expect(result).toBe(mockResponses.nanoid.default);
    });

    it("should use dynamic import to load nanoid", async () => {
      await generateUniqueId();
      const { nanoid } = await import("nanoid");
      expect(nanoid).toHaveBeenCalled();
    });

    it("should return different ids on subsequent calls", async () => {
      const { nanoid } = await import("nanoid");
      const mockNanoid = nanoid as jest.Mock;

      mockNanoid
        .mockImplementationOnce(() => mockResponses.nanoid.sequence[0])
        .mockImplementationOnce(() => mockResponses.nanoid.sequence[1]);

      const id1 = await generateUniqueId();
      const id2 = await generateUniqueId();

      expect(id1).toBe(mockResponses.nanoid.sequence[0]);
      expect(id2).toBe(mockResponses.nanoid.sequence[1]);
      expect(id1).not.toBe(id2);
    });
  });
});
