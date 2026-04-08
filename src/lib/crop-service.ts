import { calculateCropMetrics, normalizeCropName, sortCropRecords } from "@/lib/crop-math";
import { ensureDatabase } from "@/lib/ensure-database";
import { adminCropUpdateSchema, cropInputSchema, cropSortModeSchema } from "@/lib/crop-schema";
import { prisma } from "@/lib/prisma";
import type { CropRecord, CropSortMode, MaturityUnit } from "@/types/crop";

type CropRow = {
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
};

export class CropNotFoundError extends Error {
  constructor() {
    super("作物记录不存在");
    this.name = "CropNotFoundError";
  }
}

export class CropVersionConflictError extends Error {
  latestCrop: CropRecord;

  constructor(latestCrop: CropRecord) {
    super("这条数据已被其他页面修改，请以最新数据为准。");
    this.name = "CropVersionConflictError";
    this.latestCrop = latestCrop;
  }
}

function hasPrismaErrorCode(error: unknown, code: string) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === code
  );
}

function serializeCrop(crop: CropRow): CropRecord {
  const maturityUnit = crop.maturityUnit as MaturityUnit;
  const metrics = calculateCropMetrics({
    ...crop,
    maturityUnit,
  });

  return {
    ...crop,
    maturityUnit,
    ...metrics,
    createdAt: crop.createdAt.toISOString(),
    updatedAt: crop.updatedAt.toISOString(),
  };
}

export function parseSortMode(sort: string | null | undefined): CropSortMode {
  return cropSortModeSchema.parse(sort ?? "profit_per_hour");
}

export async function getCrops(sortMode: CropSortMode) {
  await ensureDatabase();
  const crops = await prisma.crop.findMany({
    orderBy: [{ createdAt: "desc" }],
  });

  return sortCropRecords(crops.map(serializeCrop), sortMode);
}

export async function createCrop(input: unknown) {
  await ensureDatabase();
  const parsed = cropInputSchema.parse(input);
  const nameNormalized = normalizeCropName(parsed.name);

  try {
    const created = await prisma.crop.create({
      data: {
        ...parsed,
        nameNormalized,
      },
    });

    return serializeCrop(created);
  } catch (error) {
    if (hasPrismaErrorCode(error, "P2002")) {
      throw new Error("该作物名称已存在");
    }

    throw error;
  }
}

export async function updateCropById(id: string, input: unknown) {
  await ensureDatabase();
  const parsed = adminCropUpdateSchema.parse(input);
  const { updatedAt, ...cropInput } = parsed;
  const nameNormalized = normalizeCropName(cropInput.name);
  const current = await prisma.crop.findUnique({
    where: {
      id,
    },
  });

  if (!current) {
    throw new CropNotFoundError();
  }

  if (current.updatedAt.toISOString() !== updatedAt) {
    throw new CropVersionConflictError(serializeCrop(current));
  }

  try {
    const result = await prisma.crop.updateMany({
      where: {
        id,
        updatedAt: current.updatedAt,
      },
      data: {
        ...cropInput,
        nameNormalized,
      },
    });

    if (result.count === 0) {
      const latest = await prisma.crop.findUnique({
        where: {
          id,
        },
      });

      if (!latest) {
        throw new CropNotFoundError();
      }

      throw new CropVersionConflictError(serializeCrop(latest));
    }

    const updated = await prisma.crop.findUnique({
      where: {
        id,
      },
    });

    if (!updated) {
      throw new CropNotFoundError();
    }

    return serializeCrop(updated);
  } catch (error) {
    if (hasPrismaErrorCode(error, "P2002")) {
      throw new Error("该作物名称已存在");
    }

    throw error;
  }
}

export async function deleteCropById(id: string) {
  await ensureDatabase();
  await prisma.crop.delete({
    where: {
      id,
    },
  });
}
