export const maturityUnits = ["minute", "hour", "day"] as const;

export type MaturityUnit = (typeof maturityUnits)[number];

export const cropSortModes = ["profit_per_hour", "exp_per_hour"] as const;

export type CropSortMode = (typeof cropSortModes)[number];

export type CropInput = {
  name: string;
  purchasePrice: number;
  yieldQuantity: number;
  experienceGain: number;
  saleTotalPrice: number;
  maturityValue: number;
  maturityUnit: MaturityUnit;
};

export type AdminCropUpdateInput = CropInput & {
  updatedAt: string;
};

export type CropRecord = {
  id: string;
  name: string;
  nameNormalized: string;
  purchasePrice: number;
  yieldQuantity: number;
  experienceGain: number;
  saleTotalPrice: number;
  maturityValue: number;
  maturityUnit: MaturityUnit;
  maturityHours: number;
  profit: number;
  profitPerHour: number;
  experiencePerHour: number;
  createdAt: string;
  updatedAt: string;
};
