import { Prisma } from "@prisma/client";

import { calculateCropMetrics, normalizeCropName, sortCropRecords } from "@/lib/crop-math";
import { ensureDatabase } from "@/lib/ensure-database";
import { cropInputSchema, cropSortModeSchema } from "@/lib/crop-schema";
import { prisma } from "@/lib/prisma";
import type { CropRecord, CropSortMode, MaturityUnit } from "@/types/crop";

function serializeCrop(crop: {
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
}): CropRecord {
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
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
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
