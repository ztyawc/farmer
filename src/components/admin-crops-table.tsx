"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import {
  buildAdminCropListHref,
  getAdminPageNumbers,
} from "@/lib/admin-crop-list";
import { formatMaturityLabel } from "@/lib/crop-math";
import type {
  AdminCropListParams,
  AdminCropListResult,
  AdminCropSortMode,
  AdminCropUpdateInput,
  CropRecord,
  MaturityUnit,
} from "@/types/crop";

const numberFormatter = new Intl.NumberFormat("zh-CN", {
  maximumFractionDigits: 2,
});

const sortOptions: Array<{ value: AdminCropSortMode; label: string }> = [
  { value: "name", label: "作物名称" },
  { value: "updated_at", label: "最近更新" },
  { value: "created_at", label: "最新创建" },
];

const maturityUnitOptions: Array<{ value: MaturityUnit; label: string }> = [
  { value: "minute", label: "分钟" },
  { value: "hour", label: "小时" },
  { value: "day", label: "天" },
];

function formatNumber(value: number) {
  return numberFormatter.format(value);
}

function createFormData(crop: CropRecord): AdminCropUpdateInput {
  return {
    name: crop.name,
    purchasePrice: crop.purchasePrice,
    yieldQuantity: crop.yieldQuantity,
    experienceGain: crop.experienceGain,
    saleTotalPrice: crop.saleTotalPrice,
    maturityValue: crop.maturityValue,
    maturityUnit: crop.maturityUnit,
    updatedAt: crop.updatedAt,
  };
}

function createListParams(
  result: AdminCropListResult,
  overrides?: Partial<AdminCropListParams>,
): AdminCropListParams {
  return {
    query: result.query,
    page: result.currentPage,
    sort: result.sort,
    ...overrides,
  };
}

export function AdminCropsTable({
  initialResult,
}: {
  initialResult: AdminCropListResult;
}) {
  const router = useRouter();
  const [isNavigating, startNavigation] = useTransition();
  const [listResult, setListResult] = useState(initialResult);
  const [queryInput, setQueryInput] = useState(initialResult.query);
  const [deleteBusyId, setDeleteBusyId] = useState<string | null>(null);
  const [saveBusyId, setSaveBusyId] = useState<string | null>(null);
  const [editingCrop, setEditingCrop] = useState<CropRecord | null>(null);
  const [formData, setFormData] = useState<AdminCropUpdateInput | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    setListResult(initialResult);
    setQueryInput(initialResult.query);
  }, [initialResult]);

  useEffect(() => {
    if (!editingCrop) {
      return;
    }

    document.body.classList.add("fluent-modal-open");
    document.documentElement.classList.add("fluent-modal-open");

    return () => {
      document.body.classList.remove("fluent-modal-open");
      document.documentElement.classList.remove("fluent-modal-open");
    };
  }, [editingCrop]);

  function navigate(params: AdminCropListParams) {
    const href = buildAdminCropListHref(params);
    startNavigation(() => {
      router.replace(href, { scroll: false });
    });
  }

  function replaceCrop(nextCrop: CropRecord) {
    setListResult((current) => ({
      ...current,
      crops: current.crops.map((crop) => (crop.id === nextCrop.id ? nextCrop : crop)),
    }));
  }

  function openEditor(crop: CropRecord) {
    setEditingCrop(crop);
    setFormData(createFormData(crop));
    setErrorMessage("");
    setSuccessMessage("");
  }

  function closeEditor() {
    setEditingCrop(null);
    setFormData(null);
  }

  function updateField<Key extends keyof AdminCropUpdateInput>(
    key: Key,
    value: AdminCropUpdateInput[Key],
  ) {
    setFormData((current) =>
      current
        ? {
            ...current,
            [key]: value,
          }
        : current,
    );
  }

  function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    navigate(
      createListParams(listResult, {
        query: queryInput.trim(),
        page: 1,
      }),
    );
  }

  function handleResetFilters() {
    setQueryInput("");
    navigate({
      query: "",
      page: 1,
      sort: "name",
    });
  }

  function handleSortChange(sort: AdminCropSortMode) {
    navigate(
      createListParams(listResult, {
        sort,
        page: 1,
      }),
    );
  }

  function handlePageChange(page: number) {
    if (page === listResult.currentPage || page < 1 || page > listResult.totalPages) {
      return;
    }

    navigate(
      createListParams(listResult, {
        page,
      }),
    );
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm("确定要删除这条作物记录吗？");

    if (!confirmed) {
      return;
    }

    setDeleteBusyId(id);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch(`/api/admin/crops/${id}`, {
        method: "DELETE",
      });
      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? "删除失败");
      }

      if (listResult.currentPage > 1 && listResult.crops.length === 1) {
        handlePageChange(listResult.currentPage - 1);
        return;
      }

      const nextTotalCount = Math.max(0, listResult.totalCount - 1);
      const nextTotalPages = Math.max(1, Math.ceil(nextTotalCount / listResult.pageSize));

      setListResult((current) => ({
        ...current,
        crops: current.crops.filter((crop) => crop.id !== id),
        totalCount: nextTotalCount,
        totalPages: nextTotalPages,
      }));
      setSuccessMessage("作物记录已删除。");

      if (editingCrop?.id === id) {
        closeEditor();
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "删除作物时发生错误。",
      );
    } finally {
      setDeleteBusyId(null);
    }
  }

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!editingCrop || !formData) {
      return;
    }

    setSaveBusyId(editingCrop.id);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch(`/api/admin/crops/${editingCrop.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const payload = (await response.json()) as {
        crop?: CropRecord;
        error?: string;
      };

      if (response.status === 409 && payload.crop) {
        replaceCrop(payload.crop);
        setEditingCrop(payload.crop);
        setFormData(createFormData(payload.crop));
        setErrorMessage(payload.error ?? "这条数据已被其他页面修改，请以最新数据为准。");
        return;
      }

      if (!response.ok || !payload.crop) {
        throw new Error(payload.error ?? "保存失败");
      }

      replaceCrop(payload.crop);
      setSuccessMessage(`已更新 ${payload.crop.name} 的作物数据。`);
      closeEditor();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "更新作物时发生错误。",
      );
    } finally {
      setSaveBusyId(null);
    }
  }

  const pageNumbers = getAdminPageNumbers(listResult.currentPage, listResult.totalPages);

  return (
    <>
      <section className="fluent-panel overflow-hidden">
        <div className="fluent-toolbar border-b-0">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--foreground-soft)]">
              Data Moderation
            </div>
            <h2 className="mt-2 text-2xl font-semibold text-[var(--foreground)]">
              作物数据表
            </h2>
            <p className="mt-2 text-sm text-[var(--foreground-soft)]">
              支持搜索、排序和分页查看，桌面端用表格管理，手机端自动切换成卡片。
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="fluent-badge">共 {listResult.totalCount} 条</span>
            <span className="fluent-badge">
              第 {listResult.currentPage} / {listResult.totalPages} 页
            </span>
            <span className="fluent-badge">
              {isNavigating ? "正在更新" : "列表就绪"}
            </span>
          </div>
        </div>

        <div className="border-b border-[rgba(255,255,255,0.58)] px-4 py-4 sm:px-5">
          <form
            onSubmit={handleSearchSubmit}
            className="grid gap-3 md:grid-cols-[minmax(0,1fr)_220px_auto_auto] md:items-end"
          >
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[var(--foreground)]">
                搜索作物名称
              </span>
              <input
                value={queryInput}
                onChange={(event) => setQueryInput(event.target.value)}
                placeholder="输入作物名称筛选"
                className="fluent-input"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[var(--foreground)]">
                排序方式
              </span>
              <select
                value={listResult.sort}
                onChange={(event) => handleSortChange(event.target.value as AdminCropSortMode)}
                className="fluent-select"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="submit"
              disabled={isNavigating}
              className="fluent-button disabled:cursor-not-allowed disabled:opacity-70"
            >
              搜索
            </button>

            <button
              type="button"
              onClick={handleResetFilters}
              disabled={isNavigating}
              className="fluent-button fluent-button-secondary disabled:cursor-not-allowed disabled:opacity-70"
            >
              重置
            </button>
          </form>
        </div>

        {(errorMessage || successMessage) && (
          <div
            className={`mx-4 mt-4 rounded-[18px] border px-4 py-3 text-sm ${
              errorMessage
                ? "border-[rgba(196,43,28,0.16)] bg-[rgba(196,43,28,0.08)] text-[var(--danger)]"
                : "border-[rgba(16,124,16,0.16)] bg-[rgba(16,124,16,0.08)] text-[var(--success)]"
            }`}
          >
            {errorMessage || successMessage}
          </div>
        )}

        {listResult.crops.length === 0 ? (
          <div className="px-6 py-16 text-center text-[var(--foreground-soft)]">
            没有匹配的作物记录。
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto px-3 pb-3 pt-4 md:block">
              <table className="fluent-table min-w-[1180px]">
                <thead>
                  <tr>
                    <th>作物名称</th>
                    <th>购买价格</th>
                    <th>出售总价</th>
                    <th>净利润</th>
                    <th>经验</th>
                    <th>成熟时间</th>
                    <th>更新时间</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {listResult.crops.map((crop) => (
                    <tr key={crop.id}>
                      <td className="font-semibold">{crop.name}</td>
                      <td>{formatNumber(crop.purchasePrice)}</td>
                      <td>{formatNumber(crop.saleTotalPrice)}</td>
                      <td className="font-semibold text-[var(--accent-strong)]">
                        {formatNumber(crop.profit)}
                      </td>
                      <td>{formatNumber(crop.experienceGain)}</td>
                      <td>
                        <div>{formatMaturityLabel(crop.maturityValue, crop.maturityUnit)}</div>
                        <div className="mt-1 text-xs text-[var(--foreground-soft)]">
                          折算 {formatNumber(crop.maturityHours)} 小时
                        </div>
                      </td>
                      <td className="text-[var(--foreground-soft)]">
                        {new Date(crop.updatedAt).toLocaleString("zh-CN")}
                      </td>
                      <td>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => openEditor(crop)}
                            className="fluent-button fluent-button-secondary min-h-[36px] px-4 text-xs"
                          >
                            编辑
                          </button>
                          <button
                            type="button"
                            disabled={deleteBusyId === crop.id}
                            onClick={() => handleDelete(crop.id)}
                            className="fluent-button fluent-danger min-h-[36px] px-4 text-xs disabled:cursor-not-allowed disabled:opacity-70"
                          >
                            {deleteBusyId === crop.id ? "删除中..." : "删除"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid gap-3 px-4 pb-4 pt-4 md:hidden">
              {listResult.crops.map((crop) => (
                <article key={crop.id} className="fluent-panel p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-lg font-semibold text-[var(--foreground)]">
                        {crop.name}
                      </div>
                      <div className="mt-1 text-xs text-[var(--foreground-soft)]">
                        更新于 {new Date(crop.updatedAt).toLocaleString("zh-CN")}
                      </div>
                    </div>
                    <span className="fluent-badge">
                      净利润 {formatNumber(crop.profit)}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <InfoCell label="购买价格" value={formatNumber(crop.purchasePrice)} />
                    <InfoCell label="出售总价" value={formatNumber(crop.saleTotalPrice)} />
                    <InfoCell label="经验" value={formatNumber(crop.experienceGain)} />
                    <InfoCell
                      label="成熟时间"
                      value={formatMaturityLabel(crop.maturityValue, crop.maturityUnit)}
                    />
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      onClick={() => openEditor(crop)}
                      className="fluent-button fluent-button-secondary flex-1"
                    >
                      编辑
                    </button>
                    <button
                      type="button"
                      disabled={deleteBusyId === crop.id}
                      onClick={() => handleDelete(crop.id)}
                      className="fluent-button fluent-danger flex-1 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {deleteBusyId === crop.id ? "删除中..." : "删除"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}

        <div className="flex flex-col gap-3 border-t border-[rgba(255,255,255,0.58)] px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-[var(--foreground-soft)]">
            当前筛选：
            {listResult.query ? ` “${listResult.query}”` : " 全部作物"}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={isNavigating || listResult.currentPage <= 1}
              onClick={() => handlePageChange(listResult.currentPage - 1)}
              className="fluent-button fluent-button-secondary min-h-[38px] px-4 text-sm disabled:cursor-not-allowed disabled:opacity-70"
            >
              上一页
            </button>

            {pageNumbers.map((page) => (
              <button
                key={page}
                type="button"
                disabled={isNavigating}
                onClick={() => handlePageChange(page)}
                className={`min-h-[38px] rounded-full px-4 text-sm font-semibold transition ${
                  page === listResult.currentPage
                    ? "bg-[var(--accent)] text-white shadow-[0_10px_24px_rgba(15,108,189,0.24)]"
                    : "border border-[rgba(154,179,209,0.34)] bg-[rgba(255,255,255,0.74)] text-[var(--foreground)]"
                } disabled:cursor-not-allowed disabled:opacity-70`}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              disabled={isNavigating || listResult.currentPage >= listResult.totalPages}
              onClick={() => handlePageChange(listResult.currentPage + 1)}
              className="fluent-button fluent-button-secondary min-h-[38px] px-4 text-sm disabled:cursor-not-allowed disabled:opacity-70"
            >
              下一页
            </button>
          </div>
        </div>
      </section>

      {editingCrop && formData && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto overscroll-contain bg-[rgba(225,236,250,0.45)] px-3 py-3 backdrop-blur-xl sm:px-4 sm:py-8 sm:items-center">
          <div className="fluent-shell fluent-modal-scroll w-full max-w-2xl max-h-[calc(100svh-1rem)] overflow-y-auto overscroll-contain sm:max-h-[calc(100svh-2rem)]">
            <div className="fluent-toolbar fluent-modal-toolbar">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--foreground-soft)]">
                  Crop Editor
                </div>
                <h2 className="mt-2 text-3xl font-semibold text-[var(--foreground)]">
                  编辑作物
                </h2>
              </div>
              <button
                type="button"
                onClick={closeEditor}
                className="fluent-button fluent-button-secondary"
              >
                关闭
              </button>
            </div>

            <form className="fluent-modal-form grid gap-4 p-6 sm:grid-cols-2" onSubmit={handleSave}>
              <Field label="作物名称">
                <input
                  required
                  value={formData.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  className="fluent-input"
                  placeholder="例：番茄"
                />
              </Field>

              <NumberField
                label="购买价格"
                value={formData.purchasePrice}
                onChange={(value) => updateField("purchasePrice", value)}
              />

              <NumberField
                label="收益数量"
                value={formData.yieldQuantity}
                onChange={(value) => updateField("yieldQuantity", value)}
              />

              <NumberField
                label="收益经验"
                value={formData.experienceGain}
                min={0}
                onChange={(value) => updateField("experienceGain", value)}
              />

              <NumberField
                label="出售总价"
                value={formData.saleTotalPrice}
                onChange={(value) => updateField("saleTotalPrice", value)}
              />

              <NumberField
                label="成熟时间数值"
                value={formData.maturityValue}
                onChange={(value) => updateField("maturityValue", value)}
              />

              <Field label="成熟时间单位">
                <select
                  value={formData.maturityUnit}
                  onChange={(event) =>
                    updateField("maturityUnit", event.target.value as MaturityUnit)
                  }
                  className="fluent-select"
                >
                  {maturityUnitOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="最后更新时间">
                <div className="fluent-input flex items-center bg-[rgba(255,255,255,0.66)] text-sm text-[var(--foreground-soft)]">
                  {new Date(formData.updatedAt).toLocaleString("zh-CN")}
                </div>
              </Field>

              <div className="sm:col-span-2 flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm leading-6 text-[var(--foreground-soft)]">
                  保存时会校验这条数据有没有被别的页面修改，避免后台互相覆盖。
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={closeEditor}
                    className="fluent-button fluent-button-secondary"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    disabled={saveBusyId === editingCrop.id}
                    className="fluent-button disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {saveBusyId === editingCrop.id ? "保存中..." : "保存修改"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-semibold text-[var(--foreground)]">{label}</span>
      {children}
    </label>
  );
}

function NumberField({
  label,
  value,
  onChange,
  min = 0.01,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
}) {
  return (
    <Field label={label}>
      <input
        required
        min={min}
        step="0.01"
        type="number"
        value={Number.isNaN(value) ? "" : value}
        onChange={(event) => onChange(event.target.value === "" ? 0 : Number(event.target.value))}
        className="fluent-input"
      />
    </Field>
  );
}

function InfoCell({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[16px] border border-[rgba(154,179,209,0.24)] bg-[rgba(255,255,255,0.56)] px-3 py-3">
      <div className="text-xs text-[var(--foreground-soft)]">{label}</div>
      <div className="mt-1 font-semibold text-[var(--foreground)]">{value}</div>
    </div>
  );
}
