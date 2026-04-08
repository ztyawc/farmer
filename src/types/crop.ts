export const maturityUnits = ["minute", "hour", "day"] as const;

export type MaturityUnit = (typeof maturityUnits)[number];

export const cropSortModes = ["profit_per_hour", "exp_per_hour"] as const;

export type CropSortMode = (typeof cropSortModes)[number];

export const adminCropSortModes = ["name", "updated_at", "created_at"] as const;

export type AdminCropSortMode = (typeof adminCropSortModes)[number];

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

export type AdminCropListParams = {
  query: string;
  page: number;
  sort: AdminCropSortMode;
};

export type AdminCropListResult = {
  crops: CropRecord[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  query: string;
  sort: AdminCropSortMode;
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
