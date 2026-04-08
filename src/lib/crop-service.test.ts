import { beforeEach, describe, expect, it, vi } from "vitest";

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    crop: {
      create: vi.fn(),
      delete: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      updateMany: vi.fn(),
    },
  },
}));

vi.mock("./ensure-database", () => ({
  ensureDatabase: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("./prisma", () => ({
  prisma: prismaMock,
}));

import {
  CropNotFoundError,
  CropVersionConflictError,
  updateCropById,
} from "./crop-service";

function createCropRow(overrides?: Partial<{
  id: string;
  name: string;
  nameNormalized: string;
  purchasePrice: number;
  yieldQuantity: number;
  experienceGain: number;
  saleTotalPrice: number;
  maturityValue: number;
  maturityUnit: string;
  createdAt: Date;
  updatedAt: Date;
}>) {
  return {
    id: "crop-1",
    name: "番茄",
    nameNormalized: "番茄",
    purchasePrice: 2,
    yieldQuantity: 5,
    experienceGain: 10,
    saleTotalPrice: 25,
    maturityValue: 2,
    maturityUnit: "hour",
    createdAt: new Date("2026-04-08T08:00:00.000Z"),
    updatedAt: new Date("2026-04-08T08:00:00.000Z"),
    ...overrides,
  };
}

describe("crop service optimistic concurrency", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("updates a crop when updatedAt matches", async () => {
    const current = createCropRow();
    const updated = createCropRow({
      saleTotalPrice: 30,
      updatedAt: new Date("2026-04-08T09:00:00.000Z"),
    });

    prismaMock.crop.findUnique
      .mockResolvedValueOnce(current)
      .mockResolvedValueOnce(updated);
    prismaMock.crop.updateMany.mockResolvedValue({ count: 1 });

    const result = await updateCropById("crop-1", {
      name: "番茄",
      purchasePrice: 2,
      yieldQuantity: 5,
      experienceGain: 10,
      saleTotalPrice: 30,
      maturityValue: 2,
      maturityUnit: "hour",
      updatedAt: current.updatedAt.toISOString(),
    });

    expect(prismaMock.crop.updateMany).toHaveBeenCalledWith({
      where: {
        id: "crop-1",
        updatedAt: current.updatedAt,
      },
      data: {
        name: "番茄",
        nameNormalized: "番茄",
        purchasePrice: 2,
        yieldQuantity: 5,
        experienceGain: 10,
        saleTotalPrice: 30,
        maturityValue: 2,
        maturityUnit: "hour",
      },
    });
    expect(result.saleTotalPrice).toBe(30);
    expect(result.updatedAt).toBe(updated.updatedAt.toISOString());
  });

  it("throws not found when the crop no longer exists", async () => {
    prismaMock.crop.findUnique.mockResolvedValue(null);

    await expect(
      updateCropById("missing", {
        name: "番茄",
        purchasePrice: 2,
        yieldQuantity: 5,
        experienceGain: 10,
        saleTotalPrice: 30,
        maturityValue: 2,
        maturityUnit: "hour",
        updatedAt: "2026-04-08T08:00:00.000Z",
      }),
    ).rejects.toBeInstanceOf(CropNotFoundError);
  });

  it("throws a conflict before updating when updatedAt is stale", async () => {
    const current = createCropRow({
      updatedAt: new Date("2026-04-08T09:00:00.000Z"),
    });

    prismaMock.crop.findUnique.mockResolvedValue(current);

    await expect(
      updateCropById("crop-1", {
        name: "番茄",
        purchasePrice: 2,
        yieldQuantity: 5,
        experienceGain: 10,
        saleTotalPrice: 30,
        maturityValue: 2,
        maturityUnit: "hour",
        updatedAt: "2026-04-08T08:00:00.000Z",
      }),
    ).rejects.toMatchObject({
      latestCrop: expect.objectContaining({
        id: "crop-1",
        updatedAt: current.updatedAt.toISOString(),
      }),
    });

    expect(prismaMock.crop.updateMany).not.toHaveBeenCalled();
  });

  it("throws a conflict when another update wins during save", async () => {
    const current = createCropRow();
    const latest = createCropRow({
      saleTotalPrice: 35,
      updatedAt: new Date("2026-04-08T10:00:00.000Z"),
    });

    prismaMock.crop.findUnique
      .mockResolvedValueOnce(current)
      .mockResolvedValueOnce(latest);
    prismaMock.crop.updateMany.mockResolvedValue({ count: 0 });

    try {
      await updateCropById("crop-1", {
        name: "番茄",
        purchasePrice: 2,
        yieldQuantity: 5,
        experienceGain: 10,
        saleTotalPrice: 30,
        maturityValue: 2,
        maturityUnit: "hour",
        updatedAt: current.updatedAt.toISOString(),
      });
    } catch (error) {
      expect(error).toBeInstanceOf(CropVersionConflictError);
      expect(error).toMatchObject({
        latestCrop: expect.objectContaining({
          saleTotalPrice: 35,
          updatedAt: latest.updatedAt.toISOString(),
        }),
      });
      return;
    }

    throw new Error("Expected a version conflict");
  });
});
