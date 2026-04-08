import {
  adminCropSortModes,
  type AdminCropListParams,
  type AdminCropSortMode,
} from "@/types/crop";

export const ADMIN_CROP_PAGE_SIZE = 20;
export const DEFAULT_ADMIN_CROP_SORT: AdminCropSortMode = "name";

function takeFirstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function isAdminCropSortMode(value: string): value is AdminCropSortMode {
  return adminCropSortModes.includes(value as AdminCropSortMode);
}

export function parseAdminCropListParams(input: {
  query?: string | string[] | undefined;
  page?: string | string[] | undefined;
  sort?: string | string[] | undefined;
}): AdminCropListParams {
  const query = takeFirstValue(input.query)?.trim() ?? "";
  const pageValue = Number(takeFirstValue(input.page) ?? "1");
  const sortValue = takeFirstValue(input.sort);

  return {
    query,
    page: Number.isInteger(pageValue) && pageValue > 0 ? pageValue : 1,
    sort: sortValue && isAdminCropSortMode(sortValue) ? sortValue : DEFAULT_ADMIN_CROP_SORT,
  };
}

export function buildAdminCropListHref(params: AdminCropListParams) {
  const searchParams = new URLSearchParams();

  if (params.query) {
    searchParams.set("query", params.query);
  }

  if (params.page > 1) {
    searchParams.set("page", String(params.page));
  }

  if (params.sort !== DEFAULT_ADMIN_CROP_SORT) {
    searchParams.set("sort", params.sort);
  }

  const queryString = searchParams.toString();
  return queryString ? `/admin?${queryString}` : "/admin";
}

export function getAdminPageNumbers(currentPage: number, totalPages: number) {
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, currentPage + 2);
  const pages: number[] = [];

  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }

  return pages;
}
