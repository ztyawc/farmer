import { z } from "zod";

import { cropSortModes, maturityUnits } from "@/types/crop";

const positiveNumber = z
  .number({
    error: "请输入数字",
  })
  .finite("请输入有效数字")
  .positive("必须大于 0");

const nonNegativeNumber = z
  .number({
    error: "请输入数字",
  })
  .finite("请输入有效数字")
  .min(0, "不能小于 0");

export const cropInputSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "作物名称不能为空")
    .max(40, "作物名称不能超过 40 个字符"),
  purchasePrice: positiveNumber,
  yieldQuantity: positiveNumber,
  experienceGain: nonNegativeNumber,
  saleTotalPrice: positiveNumber,
  maturityValue: positiveNumber,
  maturityUnit: z.enum(maturityUnits, {
    error: "成熟时间单位无效",
  }),
});

export const adminCropUpdateSchema = cropInputSchema.extend({
  updatedAt: z.string().datetime({
    error: "更新时间格式无效",
  }),
});

export const cropSortModeSchema = z.enum(cropSortModes).catch("profit_per_hour");
