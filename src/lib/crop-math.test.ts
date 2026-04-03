import { describe, expect, it } from "vitest";

import {
  calculateAdjustedProfitMetrics,
  calculateCropMetrics,
  calculateWateringMetrics,
  calculateSaleMultiplier,
  convertMaturityToHours,
  formatDurationFromMinutes,
  normalizeCropName,
  sortCropRecords,
} from "./crop-math";
import type { CropRecord } from "../types/crop";

describe("crop math", () => {
  it("converts minute, hour, and day maturity values into hours", () => {
    expect(convertMaturityToHours(30, "minute")).toBe(0.5);
    expect(convertMaturityToHours(3, "hour")).toBe(3);
    expect(convertMaturityToHours(2, "day")).toBe(48);
  });

  it("calculates base profit and experience per hour", () => {
    expect(
      calculateCropMetrics({
        purchasePrice: 40,
        yieldQuantity: 4,
        experienceGain: 18,
        saleTotalPrice: 100,
        maturityValue: 2,
        maturityUnit: "hour",
      }),
    ).toMatchObject({
      maturityHours: 2,
      profit: 60,
      profitPerHour: 30,
      experiencePerHour: 9,
    });
  });

  it("calculates adjusted sale total and adjusted profit with bonuses", () => {
    expect(
      calculateSaleMultiplier({
        hasMaxLevelBonus: true,
        stallBonusPercent: 20,
      }),
    ).toBe(2.4);

    expect(
      calculateAdjustedProfitMetrics(
        {
          purchasePrice: 2,
          yieldQuantity: 5,
          experienceGain: 10,
          saleTotalPrice: 25,
          maturityValue: 2,
          maturityUnit: "hour",
        },
        {
          hasMaxLevelBonus: true,
          stallBonusPercent: 20,
        },
      ),
    ).toMatchObject({
      adjustedSaleTotal: 60,
      adjustedProfit: 58,
      adjustedProfitPerHour: 29,
    });
  });

  it("calculates watering reduction and moisture durations from maturity time", () => {
    expect(
      calculateWateringMetrics({
        maturityValue: 1,
        maturityUnit: "hour",
      }),
    ).toMatchObject({
      maturityMinutes: 60,
      wateringReductionMinutes: 5,
      wateringMoistureMinutes: 20,
    });

    expect(
      calculateWateringMetrics({
        maturityValue: 8,
        maturityUnit: "hour",
      }),
    ).toMatchObject({
      maturityMinutes: 480,
      wateringReductionMinutes: 40,
      wateringMoistureMinutes: 160,
    });
  });

  it("formats watering durations in minutes and hour-minute labels", () => {
    expect(formatDurationFromMinutes(5)).toBe("5分钟");
    expect(formatDurationFromMinutes(20)).toBe("20分钟");
    expect(formatDurationFromMinutes(160)).toBe("2小时40分钟");
  });

  it("normalizes duplicated crop names", () => {
    expect(normalizeCropName("  白菜   王  ")).toBe("白菜 王");
  });

  it("sorts by profit or experience per hour", () => {
    const crops: CropRecord[] = [
      {
        id: "1",
        name: "萝卜",
        nameNormalized: "萝卜",
        purchasePrice: 10,
        yieldQuantity: 1,
        experienceGain: 5,
        saleTotalPrice: 50,
        maturityValue: 2,
        maturityUnit: "hour",
        maturityHours: 2,
        profit: 40,
        profitPerHour: 20,
        experiencePerHour: 2.5,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "2",
        name: "南瓜",
        nameNormalized: "南瓜",
        purchasePrice: 30,
        yieldQuantity: 2,
        experienceGain: 42,
        saleTotalPrice: 110,
        maturityValue: 4,
        maturityUnit: "hour",
        maturityHours: 4,
        profit: 80,
        profitPerHour: 20,
        experiencePerHour: 10.5,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "3",
        name: "辣椒",
        nameNormalized: "辣椒",
        purchasePrice: 20,
        yieldQuantity: 2,
        experienceGain: 8,
        saleTotalPrice: 100,
        maturityValue: 2,
        maturityUnit: "hour",
        maturityHours: 2,
        profit: 80,
        profitPerHour: 40,
        experiencePerHour: 4,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    expect(sortCropRecords(crops, "profit_per_hour").map((crop) => crop.name)).toEqual([
      "辣椒",
      "南瓜",
      "萝卜",
    ]);

    expect(sortCropRecords(crops, "exp_per_hour").map((crop) => crop.name)).toEqual([
      "南瓜",
      "辣椒",
      "萝卜",
    ]);
  });
});
