"use client";

import { useEffect, useState } from "react";

import { formatMaturityLabel } from "@/lib/crop-math";
import type {
  AdminCropUpdateInput,
  CropRecord,
  MaturityUnit,
} from "@/types/crop";

const numberFormatter = new Intl.NumberFormat("zh-CN", {
  maximumFractionDigits: 2,
});

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

export function AdminCropsTable({ initialCrops }: { initialCrops: CropRecord[] }) {
  const [crops, setCrops] = useState(initialCrops);
  const [query, setQuery] = useState("");
  const [deleteBusyId, setDeleteBusyId] = useState<string | null>(null);
  const [saveBusyId, setSaveBusyId] = useState<string | null>(null);
  const [editingCrop, setEditingCrop] = useState<CropRecord | null>(null);
  const [formData, setFormData] = useState<AdminCropUpdateInput | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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

  const normalizedQuery = query.trim().toLocaleLowerCase("zh-CN");
  const filteredCrops = normalizedQuery
    ? crops.filter((crop) =>
        crop.name.toLocaleLowerCase("zh-CN").includes(normalizedQuery),
      )
    : crops;

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

  function replaceCrop(nextCrop: CropRecord) {
    setCrops((current) =>
      current.map((crop) => (crop.id === nextCrop.id ? nextCrop : crop)),
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

      setCrops((current) => current.filter((crop) => crop.id !== id));
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
              支持按名称筛选，发现错误数据后可以直接编辑或删除。
            </p>
          </div>

          <div className="w-full max-w-sm">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[var(--foreground)]">
                按名称查找
              </span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="输入作物名称筛选"
                className="fluent-input"
              />
            </label>
          </div>
        </div>

        {(errorMessage || successMessage) && (
          <div
            className={`mx-4 mb-4 rounded-[18px] border px-4 py-3 text-sm ${
              errorMessage
                ? "border-[rgba(196,43,28,0.16)] bg-[rgba(196,43,28,0.08)] text-[var(--danger)]"
                : "border-[rgba(16,124,16,0.16)] bg-[rgba(16,124,16,0.08)] text-[var(--success)]"
            }`}
          >
            {errorMessage || successMessage}
          </div>
        )}

        <div className="overflow-x-auto px-3 pb-3">
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
              {filteredCrops.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-14 text-center text-[var(--foreground-soft)]">
                    没有匹配的作物记录。
                  </td>
                </tr>
              ) : (
                filteredCrops.map((crop) => (
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
                ))
              )}
            </tbody>
          </table>
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
