import type { CropRecord, CropSortMode, MaturityUnit } from "@/types/crop";

type CropMathSource = {
  purchasePrice: number;
  yieldQuantity: number;
  experienceGain: number;
  saleTotalPrice: number;
  maturityValue: number;
  maturityUnit: MaturityUnit;
};

export type ProfitBonusSettings = {
  hasMaxLevelBonus: boolean;
  stallBonusPercent: number;
};

export const WATERING_REDUCTION_RATIO = 1 / 12;
export const WATERING_MOISTURE_RATIO = 1 / 3;

export function normalizeCropName(name: string) {
  return name.trim().replace(/\s+/g, " ").toLocaleLowerCase("zh-CN");
}

export function convertMaturityToHours(value: number, unit: MaturityUnit) {
  if (unit === "minute") {
    return value / 60;
  }

  if (unit === "day") {
    return value * 24;
  }

  return value;
}

export function calculateCropMetrics(crop: CropMathSource) {
  const maturityHours = convertMaturityToHours(
    crop.maturityValue,
    crop.maturityUnit,
  );
  const profit = crop.saleTotalPrice - crop.purchasePrice;
  const profitPerHour = profit / maturityHours;
  const experiencePerHour = crop.experienceGain / maturityHours;

  return {
    maturityHours,
    profit,
    profitPerHour,
    experiencePerHour,
  };
}

export function normalizeBonusPercent(value: number) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, value);
}

export function calculateSaleMultiplier(settings: ProfitBonusSettings) {
  const maxLevelMultiplier = settings.hasMaxLevelBonus ? 2 : 1;
  const stallMultiplier = 1 + normalizeBonusPercent(settings.stallBonusPercent) / 100;

  return maxLevelMultiplier * stallMultiplier;
}

export function calculateAdjustedProfitMetrics(
  crop: CropMathSource,
  settings: ProfitBonusSettings,
) {
  const baseMetrics = calculateCropMetrics(crop);
  const adjustedSaleTotal = crop.saleTotalPrice * calculateSaleMultiplier(settings);
  const adjustedProfit = adjustedSaleTotal - crop.purchasePrice;
  const adjustedProfitPerHour = adjustedProfit / baseMetrics.maturityHours;

  return {
    ...baseMetrics,
    adjustedSaleTotal,
    adjustedProfit,
    adjustedProfitPerHour,
  };
}

export function calculateWateringMetrics(
  crop: Pick<CropMathSource, "maturityValue" | "maturityUnit">,
) {
  const maturityHours = convertMaturityToHours(crop.maturityValue, crop.maturityUnit);
  const maturityMinutes = maturityHours * 60;

  return {
    maturityMinutes,
    wateringReductionMinutes: maturityMinutes * WATERING_REDUCTION_RATIO,
    wateringMoistureMinutes: maturityMinutes * WATERING_MOISTURE_RATIO,
    wateringReductionRatio: WATERING_REDUCTION_RATIO,
    wateringMoistureRatio: WATERING_MOISTURE_RATIO,
  };
}

export function formatDurationFromMinutes(totalMinutes: number) {
  if (!Number.isFinite(totalMinutes) || totalMinutes <= 0) {
    return "0分钟";
  }

  const roundedMinutes = Math.round(totalMinutes * 100) / 100;

  if (roundedMinutes < 60) {
    return `${roundedMinutes}分钟`;
  }

  const hours = Math.floor(roundedMinutes / 60);
  const remainingMinutes = Math.round((roundedMinutes - hours * 60) * 100) / 100;

  if (remainingMinutes === 0) {
    return `${hours}小时`;
  }

  return `${hours}小时${remainingMinutes}分钟`;
}

export function sortCropRecords(crops: CropRecord[], sortMode: CropSortMode) {
  return [...crops].sort((left, right) => {
    const primary =
      sortMode === "exp_per_hour"
        ? right.experiencePerHour - left.experiencePerHour
        : right.profitPerHour - left.profitPerHour;

    if (primary !== 0) {
      return primary;
    }

    return (
      right.profit - left.profit ||
      right.experiencePerHour - left.experiencePerHour ||
      right.profitPerHour - left.profitPerHour ||
      left.name.localeCompare(right.name, "zh-CN")
    );
  });
}

export function formatMaturityLabel(value: number, unit: MaturityUnit) {
  const labelMap: Record<MaturityUnit, string> = {
    minute: "分钟",
    hour: "小时",
    day: "天",
  };

  return `${value}${labelMap[unit]}`;
}
