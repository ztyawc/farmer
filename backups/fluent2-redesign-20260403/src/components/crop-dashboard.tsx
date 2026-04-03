"use client";

import Link from "next/link";
import { useState } from "react";

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
    detail: "按收益经验 / 成熟小时数排序",
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

function getSortHeadline(sortMode: CropSortMode) {
  return sortMode === "exp_per_hour" ? "经验冲榜视图" : "利润冲榜视图";
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
    <main className="relative overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
      <div className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.55),transparent_70%)]" />
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <section className="glass-panel relative overflow-hidden rounded-[32px] p-6 sm:p-8">
          <div className="absolute right-0 top-0 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(255,224,183,0.95),transparent_65%)]" />
          <div className="relative grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-4">
              <p className="font-mono text-xs uppercase tracking-[0.35em] text-[var(--primary)]">
                Farmer Ledger
              </p>
              <div className="space-y-3">
                <h1 className="max-w-2xl font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight text-[var(--primary-strong)] sm:text-5xl">
                  菜田账本
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-[var(--muted)] sm:text-base">
                  记录每一种作物的投入、产量、经验与成熟周期，并按你当前的收益加成实时重算总利润。
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsFormOpen(true);
                    setErrorMessage("");
                    setSubmitMessage("");
                  }}
                  className="rounded-full bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--primary-strong)]"
                >
                  添加作物
                </button>
                <Link
                  href="/admin/login"
                  className="rounded-full border border-[var(--border)] bg-white/70 px-5 py-3 text-sm font-semibold text-[var(--primary-strong)] transition hover:bg-white"
                >
                  进入管理后台
                </Link>
              </div>
            </div>

            <div className="grid gap-4 rounded-[28px] border border-white/70 bg-white/60 p-5">
              <div className="rounded-[24px] bg-[var(--primary)] px-5 py-4 text-white">
                <p className="text-xs uppercase tracking-[0.24em] text-white/70">当前榜单</p>
                <p className="mt-2 font-[family-name:var(--font-display)] text-2xl">
                  {getSortHeadline(sortMode)}
                </p>
                <p className="mt-2 text-sm text-white/80">
                  {sortOptions.find((option) => option.value === sortMode)?.detail}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <SummaryCard label="已收录" value={formatNumber(displayedCrops.length)} />
                <SummaryCard
                  label="当前榜首"
                  value={displayedCrops[0]?.name ?? "暂无数据"}
                  accent
                />
              </div>
              <div className="rounded-[24px] border border-white/70 bg-white/65 px-4 py-4 text-[var(--primary-strong)]">
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                  当前售价倍率
                </p>
                <p className="mt-2 font-[family-name:var(--font-display)] text-3xl">
                  {formatNumber(saleMultiplier)}x
                </p>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  最终出售总价 = 基础出售总价 × 满级倍率 × 小摊倍率
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="glass-panel data-grid rounded-[30px] p-5">
            <div className="space-y-5">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--primary)]">
                  Sort Mode
                </p>
                <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl text-[var(--primary-strong)]">
                  排序方式
                </h2>
              </div>

              <div className="space-y-3">
                {sortOptions.map((option) => {
                  const active = option.value === sortMode;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setSortMode(option.value)}
                      className={`w-full rounded-[24px] border px-4 py-4 text-left transition ${
                        active
                          ? "border-transparent bg-[var(--primary)] text-white shadow-lg"
                          : "border-[var(--border)] bg-white/80 text-[var(--primary-strong)] hover:bg-white"
                      }`}
                    >
                      <p className="text-sm font-semibold">{option.label}</p>
                      <p
                        className={`mt-2 text-xs leading-6 ${
                          active ? "text-white/80" : "text-[var(--muted)]"
                        }`}
                      >
                        {option.detail}
                      </p>
                    </button>
                  );
                })}
              </div>

              <div className="rounded-[24px] border border-[var(--border)] bg-white/80 p-4">
                <p className="font-mono text-xs uppercase tracking-[0.22em] text-[var(--primary)]">
                  Profit Bonus
                </p>
                <h3 className="mt-2 text-lg font-semibold text-[var(--primary-strong)]">
                  收益加成设置
                </h3>

                <label className="mt-4 flex items-center gap-3 rounded-2xl bg-[var(--surface-strong)] px-3 py-3">
                  <input
                    type="checkbox"
                    checked={hasMaxLevelBonus}
                    onChange={(event) => setHasMaxLevelBonus(event.target.checked)}
                    className="h-4 w-4 accent-[var(--primary)]"
                  />
                  <span className="text-sm font-medium text-[var(--primary-strong)]">
                    满级加成（100%）
                  </span>
                </label>

                <label className="mt-4 block space-y-2">
                  <span className="text-sm font-semibold text-[var(--primary-strong)]">
                    农场小摊加成
                  </span>
                  <div className="flex items-center overflow-hidden rounded-2xl border border-[var(--border)] bg-white">
                    <input
                      value={stallBonusInput}
                      onChange={(event) => setStallBonusInput(event.target.value)}
                      placeholder="例如 20 或 25%"
                      className="w-full px-4 py-3 outline-none"
                    />
                    <span className="border-l border-[var(--border)] px-4 py-3 text-sm text-[var(--muted)]">
                      %
                    </span>
                  </div>
                </label>

                <div className="mt-4 rounded-2xl bg-[var(--surface-strong)] px-4 py-4 text-sm leading-7 text-[var(--muted)]">
                  <p>当前小摊加成：{formatNumber(stallBonusPercent)}%</p>
                  <p>满级倍率：{hasMaxLevelBonus ? "2.00x" : "1.00x"}</p>
                  <p>小摊倍率：{formatNumber(1 + stallBonusPercent / 100)}x</p>
                </div>
              </div>

              {(errorMessage || submitMessage) && (
                <div className="rounded-[24px] border border-[var(--border)] bg-white/80 p-4 text-sm leading-6">
                  {errorMessage && <p className="text-red-700">{errorMessage}</p>}
                  {!errorMessage && submitMessage && (
                    <p className="text-[var(--primary-strong)]">{submitMessage}</p>
                  )}
                </div>
              )}
            </div>
          </aside>

          <section className="glass-panel rounded-[30px] p-4 sm:p-6">
            <div className="flex flex-col gap-3 border-b border-[var(--border)] pb-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--primary)]">
                  Leaderboard
                </p>
                <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl text-[var(--primary-strong)]">
                  作物收益表
                </h2>
              </div>
              <p className="text-sm text-[var(--muted)]">
                {isLoading ? "正在同步最新数据..." : `共 ${displayedCrops.length} 条可排序记录`}
              </p>
            </div>

            {displayedCrops.length === 0 ? (
              <div className="flex min-h-72 items-center justify-center rounded-[24px] border border-dashed border-[var(--border)] bg-white/55 p-8 text-center text-[var(--muted)]">
                现在还没有作物数据，点击上方“添加作物”开始建第一条记录。
              </div>
            ) : (
              <div className="mt-5 overflow-hidden rounded-[24px] border border-[var(--border)] bg-white/70">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[1180px] border-collapse text-sm">
                    <thead className="bg-[var(--surface-strong)] text-left text-[var(--muted)]">
                      <tr>
                        <th className="px-4 py-3 font-semibold">排名</th>
                        <th className="px-4 py-3 font-semibold">作物名称</th>
                        <th className="px-4 py-3 font-semibold">购买价格</th>
                        <th className="px-4 py-3 font-semibold">收益数量</th>
                        <th className="px-4 py-3 font-semibold">收益经验</th>
                        <th className="px-4 py-3 font-semibold">基础出售总价</th>
                        <th className="px-4 py-3 font-semibold">最终出售总价</th>
                        <th className="px-4 py-3 font-semibold">总利润</th>
                        <th className="px-4 py-3 font-semibold">每小时总利润</th>
                        <th className="px-4 py-3 font-semibold">每小时经验</th>
                        <th className="px-4 py-3 font-semibold">成熟时间</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayedCrops.map((crop, index) => (
                        <tr
                          key={crop.id}
                          className="border-t border-[var(--border)] text-[var(--primary-strong)] odd:bg-white/55"
                        >
                          <td className="px-4 py-4">
                            <span className="inline-flex rounded-full bg-[var(--accent-soft)] px-3 py-1 font-mono text-xs font-semibold uppercase tracking-[0.16em]">
                              #{index + 1}
                            </span>
                          </td>
                          <td className="px-4 py-4 font-semibold">{crop.name}</td>
                          <td className="px-4 py-4">{formatNumber(crop.purchasePrice)}</td>
                          <td className="px-4 py-4">{formatNumber(crop.yieldQuantity)}</td>
                          <td className="px-4 py-4">{formatNumber(crop.experienceGain)}</td>
                          <td className="px-4 py-4">{formatNumber(crop.saleTotalPrice)}</td>
                          <td className="px-4 py-4 font-semibold text-[var(--primary)]">
                            {formatNumber(crop.adjustedSaleTotal)}
                          </td>
                          <td className="px-4 py-4 font-semibold text-[var(--primary)]">
                            {formatNumber(crop.adjustedProfit)}
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                sortMode === "profit_per_hour"
                                  ? "bg-[var(--primary)] text-white"
                                  : "bg-[var(--surface-strong)] text-[var(--primary-strong)]"
                              }`}
                            >
                              {formatNumber(crop.adjustedProfitPerHour)}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                sortMode === "exp_per_hour"
                                  ? "bg-[var(--primary)] text-white"
                                  : "bg-[var(--surface-strong)] text-[var(--primary-strong)]"
                              }`}
                            >
                              {formatNumber(crop.experiencePerHour)}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div>{formatMaturityLabel(crop.maturityValue, crop.maturityUnit)}</div>
                            <div className="mt-1 text-xs text-[var(--muted)]">
                              折算 {formatNumber(crop.maturityHours)} 小时
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>
        </section>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1f2c18]/45 px-4 py-8 backdrop-blur-sm">
          <div className="glass-panel max-h-full w-full max-w-2xl overflow-auto rounded-[30px] p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--primary)]">
                  New Crop
                </p>
                <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-[var(--primary-strong)]">
                  添加作物
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="rounded-full border border-[var(--border)] px-4 py-2 text-sm text-[var(--muted)] transition hover:bg-white"
              >
                关闭
              </button>
            </div>

            <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
              <Field label="作物名称">
                <input
                  required
                  value={formData.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--accent)]"
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
                  className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--accent)]"
                >
                  <option value="minute">分钟</option>
                  <option value="hour">小时</option>
                  <option value="day">天</option>
                </select>
              </Field>

              <div className="sm:col-span-2 flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm leading-6 text-[var(--muted)]">
                  提交后会立刻进入公开榜单，利润会按你左侧设置的加成方式实时计算。
                </p>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="rounded-full bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--primary-strong)] disabled:cursor-not-allowed disabled:opacity-65"
                >
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
      <span className="text-sm font-semibold text-[var(--primary-strong)]">{label}</span>
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
        className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--accent)]"
      />
    </Field>
  );
}

function SummaryCard({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <article
      className={`rounded-[24px] p-4 ${
        accent ? "bg-[var(--accent-soft)]" : "bg-[var(--surface-strong)]"
      }`}
    >
      <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">{label}</p>
      <p className="mt-3 font-[family-name:var(--font-display)] text-2xl text-[var(--primary-strong)]">
        {value}
      </p>
    </article>
  );
}
