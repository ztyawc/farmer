"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  calculateAdjustedProfitMetrics,
  calculateSaleMultiplier,
  formatMaturityLabel,
} from "@/lib/crop-math";
import type { CropInput, CropRecord, CropSortMode, MaturityUnit } from "@/types/crop";

const numberFormatter = new Intl.NumberFormat("zh-CN", {
  maximumFractionDigits: 2,
});

const sortOptions: Array<{ value: CropSortMode; label: string; detail: string }> = [
  {
    value: "profit_per_hour",
    label: "每小时总利润最大",
    detail: "按当前加成后的每小时总利润排序",
  },
  {
    value: "exp_per_hour",
    label: "每小时经验最大",
    detail: "按收益经验与成熟时间折算结果排序",
  },
];

const defaultFormState: CropInput = {
  name: "",
  purchasePrice: 0,
  yieldQuantity: 0,
  experienceGain: 0,
  saleTotalPrice: 0,
  maturityValue: 1,
  maturityUnit: "hour",
};

function formatNumber(value: number) {
  return numberFormatter.format(value);
}

function parsePercentInput(value: string) {
  const normalized = value.replace(/%/g, "").trim();

  if (!normalized) {
    return 0;
  }

  const parsed = Number(normalized);

  if (!Number.isFinite(parsed) || parsed < 0) {
    return 0;
  }

  return parsed;
}

export function CropDashboard({
  initialCrops,
  initialSort,
}: {
  initialCrops: CropRecord[];
  initialSort: CropSortMode;
}) {
  const [crops, setCrops] = useState(initialCrops);
  const [sortMode, setSortMode] = useState<CropSortMode>(initialSort);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState<CropInput>(defaultFormState);
  const [errorMessage, setErrorMessage] = useState("");
  const [submitMessage, setSubmitMessage] = useState("");
  const [hasMaxLevelBonus, setHasMaxLevelBonus] = useState(true);
  const [stallBonusInput, setStallBonusInput] = useState("0");

  const stallBonusPercent = parsePercentInput(stallBonusInput);
  const saleMultiplier = calculateSaleMultiplier({
    hasMaxLevelBonus,
    stallBonusPercent,
  });

  useEffect(() => {
    if (!isFormOpen) {
      return;
    }

    document.body.classList.add("fluent-modal-open");
    document.documentElement.classList.add("fluent-modal-open");

    return () => {
      document.body.classList.remove("fluent-modal-open");
      document.documentElement.classList.remove("fluent-modal-open");
    };
  }, [isFormOpen]);

  const displayedCrops = [...crops]
    .map((crop) => ({
      ...crop,
      ...calculateAdjustedProfitMetrics(crop, {
        hasMaxLevelBonus,
        stallBonusPercent,
      }),
    }))
    .sort((left, right) => {
      if (sortMode === "exp_per_hour") {
        return (
          right.experiencePerHour - left.experiencePerHour ||
          right.adjustedProfitPerHour - left.adjustedProfitPerHour ||
          left.name.localeCompare(right.name, "zh-CN")
        );
      }

      return (
        right.adjustedProfitPerHour - left.adjustedProfitPerHour ||
        right.adjustedProfit - left.adjustedProfit ||
        left.name.localeCompare(right.name, "zh-CN")
      );
    });

  async function refreshCrops() {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/crops?sort=profit_per_hour", {
        cache: "no-store",
      });
      const payload = (await response.json()) as
        | { crops: CropRecord[] }
        | { error: string };

      if (!response.ok || !("crops" in payload)) {
        throw new Error("error" in payload ? payload.error : "刷新列表失败");
      }

      setCrops(payload.crops);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "加载作物列表时发生错误",
      );
    } finally {
      setIsLoading(false);
    }
  }

  function updateField<Key extends keyof CropInput>(key: Key, value: CropInput[Key]) {
    setFormData((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setSubmitMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/crops", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? "提交失败");
      }

      setSubmitMessage("作物已成功入库，榜单已刷新。");
      setFormData(defaultFormState);
      setIsFormOpen(false);
      await refreshCrops();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "提交作物时发生错误",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="fluent-stage">
      <div className="fluent-shell mx-auto max-w-[1440px]">
        <header className="fluent-toolbar">
          <div className="flex flex-col gap-3">
            <div className="fluent-badge w-fit">Windows-Style Crop Workspace</div>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl">
                菜田账本
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-7 text-[var(--foreground-soft)] sm:text-base">
                用 Fluent 2 风格整理你的作物收益数据。左侧调整排序和收益加成，右侧像系统表格一样查看每一种作物的完整收益结构。
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/admin/login" className="fluent-button fluent-button-secondary">
              管理后台
            </Link>
            <button
              type="button"
              onClick={() => {
                setIsFormOpen(true);
                setErrorMessage("");
                setSubmitMessage("");
              }}
              className="fluent-button"
            >
              添加作物
            </button>
          </div>
        </header>

        <section className="grid gap-5 p-5 lg:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="flex flex-col gap-5">
            <section className="fluent-panel p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--foreground-soft)]">
                    排序模式
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-[var(--foreground)]">
                    当前视图
                  </h2>
                </div>
                <div className="fluent-badge">{sortMode === "exp_per_hour" ? "经验榜" : "利润榜"}</div>
              </div>

              <div className="mt-5 space-y-3">
                {sortOptions.map((option) => {
                  const active = option.value === sortMode;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setSortMode(option.value)}
                      className={`w-full rounded-[20px] border p-4 text-left transition ${
                        active
                          ? "border-[rgba(15,108,189,0.18)] bg-[var(--accent)] text-white shadow-[0_16px_34px_rgba(15,108,189,0.26)]"
                          : "border-[rgba(154,179,209,0.28)] bg-[rgba(255,255,255,0.62)] text-[var(--foreground)] hover:bg-[rgba(255,255,255,0.82)]"
                      }`}
                    >
                      <div className="text-sm font-semibold">{option.label}</div>
                      <div className={`mt-2 text-xs leading-6 ${active ? "text-white/78" : "text-[var(--foreground-soft)]"}`}>
                        {option.detail}
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="fluent-panel fluent-soft-grid p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--foreground-soft)]">
                收益加成
              </p>
              <h2 className="mt-2 text-xl font-semibold text-[var(--foreground)]">
                计算设置
              </h2>

              <label className="mt-5 flex items-center gap-3 rounded-[18px] border border-[rgba(154,179,209,0.28)] bg-[rgba(255,255,255,0.68)] px-4 py-4">
                <input
                  type="checkbox"
                  checked={hasMaxLevelBonus}
                  onChange={(event) => setHasMaxLevelBonus(event.target.checked)}
                  className="h-4 w-4 accent-[var(--accent)]"
                />
                <div>
                  <div className="text-sm font-semibold text-[var(--foreground)]">
                    满级加成（100%）
                  </div>
                  <div className="text-xs text-[var(--foreground-soft)]">
                    勾选后按 2.00x 售价倍率计算
                  </div>
                </div>
              </label>

              <label className="mt-4 block">
                <span className="mb-2 block text-sm font-semibold text-[var(--foreground)]">
                  农场小摊加成
                </span>
                <div className="flex items-center overflow-hidden rounded-[18px] border border-[rgba(154,179,209,0.34)] bg-[rgba(255,255,255,0.82)]">
                  <input
                    value={stallBonusInput}
                    onChange={(event) => setStallBonusInput(event.target.value)}
                    placeholder="例如 20 或 25%"
                    className="fluent-input rounded-none border-0 bg-transparent shadow-none focus:shadow-none"
                  />
                  <span className="border-l border-[rgba(154,179,209,0.32)] px-4 text-sm text-[var(--foreground-soft)]">
                    %
                  </span>
                </div>
              </label>

              <div className="fluent-hero-strip mt-5 rounded-[22px] border border-[rgba(255,255,255,0.75)] bg-[linear-gradient(180deg,rgba(255,255,255,0.74),rgba(233,243,255,0.72))] p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--foreground-soft)]">
                  实时倍率
                </div>
                <div className="mt-2 text-3xl font-semibold text-[var(--accent-strong)]">
                  {formatNumber(saleMultiplier)}x
                </div>
                <div className="mt-3 space-y-1 text-sm text-[var(--foreground-soft)]">
                  <p>小摊加成：{formatNumber(stallBonusPercent)}%</p>
                  <p>满级倍率：{hasMaxLevelBonus ? "2.00x" : "1.00x"}</p>
                  <p>最终售价 = 基础售价 × 满级倍率 × 小摊倍率</p>
                </div>
              </div>
            </section>

            <section className="grid grid-cols-2 gap-4">
              <SummaryCard label="已收录" value={formatNumber(displayedCrops.length)} />
              <SummaryCard label="榜首作物" value={displayedCrops[0]?.name ?? "暂无"} />
            </section>

            {(errorMessage || submitMessage) && (
              <section className="fluent-panel p-4">
                {errorMessage && <p className="text-sm text-[var(--danger)]">{errorMessage}</p>}
                {!errorMessage && submitMessage && (
                  <p className="text-sm text-[var(--success)]">{submitMessage}</p>
                )}
              </section>
            )}
          </aside>

          <section className="fluent-panel overflow-hidden">
            <div className="fluent-toolbar border-b-0">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--foreground-soft)]">
                  工作表
                </div>
                <h2 className="mt-2 text-2xl font-semibold text-[var(--foreground)]">
                  作物收益总览
                </h2>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="fluent-badge">表格视图</span>
                <span className="fluent-badge">{isLoading ? "正在同步" : `${displayedCrops.length} 条记录`}</span>
              </div>
            </div>

            {displayedCrops.length === 0 ? (
              <div className="flex min-h-[420px] items-center justify-center px-8 py-16 text-center text-[var(--foreground-soft)]">
                现在还没有作物数据。点击右上角“添加作物”，开始建立第一条收益记录。
              </div>
            ) : (
              <div className="overflow-x-auto px-3 pb-3">
                <table className="fluent-table">
                  <thead>
                    <tr>
                      <th>排名</th>
                      <th>作物名称</th>
                      <th>购买价格</th>
                      <th>收益数量</th>
                      <th>收益经验</th>
                      <th>基础出售总价</th>
                      <th>最终出售总价</th>
                      <th>总利润</th>
                      <th>每小时总利润</th>
                      <th>每小时经验</th>
                      <th>成熟时间</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedCrops.map((crop, index) => (
                      <tr key={crop.id}>
                        <td>
                          <span className="fluent-badge">#{index + 1}</span>
                        </td>
                        <td className="font-semibold">{crop.name}</td>
                        <td>{formatNumber(crop.purchasePrice)}</td>
                        <td>{formatNumber(crop.yieldQuantity)}</td>
                        <td>{formatNumber(crop.experienceGain)}</td>
                        <td>{formatNumber(crop.saleTotalPrice)}</td>
                        <td>
                          <span className="fluent-badge fluent-highlight">
                            {formatNumber(crop.adjustedSaleTotal)}
                          </span>
                        </td>
                        <td className="font-semibold text-[var(--accent-strong)]">
                          {formatNumber(crop.adjustedProfit)}
                        </td>
                        <td>
                          <span
                            className={`fluent-badge ${sortMode === "profit_per_hour" ? "bg-[var(--accent)] text-white" : "fluent-highlight"}`}
                          >
                            {formatNumber(crop.adjustedProfitPerHour)}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`fluent-badge ${sortMode === "exp_per_hour" ? "bg-[var(--accent)] text-white" : "fluent-highlight"}`}
                          >
                            {formatNumber(crop.experiencePerHour)}
                          </span>
                        </td>
                        <td>
                          <div>{formatMaturityLabel(crop.maturityValue, crop.maturityUnit)}</div>
                          <div className="mt-1 text-xs text-[var(--foreground-soft)]">
                            折算 {formatNumber(crop.maturityHours)} 小时
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </section>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto overscroll-contain bg-[rgba(225,236,250,0.45)] px-3 py-3 backdrop-blur-xl sm:px-4 sm:py-8 sm:items-center">
          <div className="fluent-shell fluent-modal-scroll w-full max-w-2xl max-h-[calc(100svh-1rem)] overflow-y-auto overscroll-contain sm:max-h-[calc(100svh-2rem)]">
            <div className="fluent-toolbar fluent-modal-toolbar">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--foreground-soft)]">
                  New Crop Entry
                </div>
                <h2 className="mt-2 text-3xl font-semibold text-[var(--foreground)]">
                  添加作物
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="fluent-button fluent-button-secondary"
              >
                关闭
              </button>
            </div>

            <form className="fluent-modal-form grid gap-4 p-6 sm:grid-cols-2" onSubmit={handleSubmit}>
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
                  <option value="minute">分钟</option>
                  <option value="hour">小时</option>
                  <option value="day">天</option>
                </select>
              </Field>

              <div className="sm:col-span-2 flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm leading-6 text-[var(--foreground-soft)]">
                  提交后会立刻进入公开榜单，利润会按左侧设置的加成方式实时计算。
                </p>
                <button type="submit" disabled={isLoading} className="fluent-button">
                  {isLoading ? "提交中..." : "保存作物"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
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

function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <section className="fluent-panel p-4">
      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--foreground-soft)]">
        {label}
      </div>
      <div className="mt-2 text-2xl font-semibold text-[var(--foreground)]">{value}</div>
    </section>
  );
}
