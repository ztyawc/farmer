"use client";

import { useState } from "react";

import { formatMaturityLabel } from "@/lib/crop-math";
import type { CropRecord } from "@/types/crop";

const numberFormatter = new Intl.NumberFormat("zh-CN", {
  maximumFractionDigits: 2,
});

function formatNumber(value: number) {
  return numberFormatter.format(value);
}

export function AdminCropsTable({ initialCrops }: { initialCrops: CropRecord[] }) {
  const [crops, setCrops] = useState(initialCrops);
  const [query, setQuery] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const normalizedQuery = query.trim().toLocaleLowerCase("zh-CN");
  const filteredCrops = normalizedQuery
    ? crops.filter((crop) =>
        crop.name.toLocaleLowerCase("zh-CN").includes(normalizedQuery),
      )
    : crops;

  async function handleDelete(id: string) {
    const confirmed = window.confirm("确定要删除这条作物记录吗？");

    if (!confirmed) {
      return;
    }

    setBusyId(id);
    setErrorMessage("");

    try {
      const response = await fetch(`/api/admin/crops/${id}`, {
        method: "DELETE",
      });
      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? "删除失败");
      }

      setCrops((current) => current.filter((crop) => crop.id !== id));
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "删除作物时发生错误",
      );
    } finally {
      setBusyId(null);
    }
  }

  return (
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
            支持按名称筛选，发现乱填数据后可以直接删除。
          </p>
        </div>

        <div className="w-full max-w-sm">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-[var(--foreground)]">
              按名称查看
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

      {errorMessage && (
        <div className="mx-4 mb-4 rounded-[18px] border border-[rgba(196,43,28,0.16)] bg-[rgba(196,43,28,0.08)] px-4 py-3 text-sm text-[var(--danger)]">
          {errorMessage}
        </div>
      )}

      <div className="overflow-x-auto px-3 pb-3">
        <table className="fluent-table min-w-[980px]">
          <thead>
            <tr>
              <th>作物名称</th>
              <th>购买价格</th>
              <th>出售总价</th>
              <th>净利润</th>
              <th>经验</th>
              <th>成熟时间</th>
              <th>创建时间</th>
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
                    {new Date(crop.createdAt).toLocaleString("zh-CN")}
                  </td>
                  <td>
                    <button
                      type="button"
                      disabled={busyId === crop.id}
                      onClick={() => handleDelete(crop.id)}
                      className="fluent-button fluent-danger min-h-[36px] px-4 text-xs disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {busyId === crop.id ? "删除中..." : "删除"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
