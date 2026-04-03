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
    <section className="glass-panel rounded-[30px] p-5 sm:p-6">
      <div className="flex flex-col gap-4 border-b border-[var(--border)] pb-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--primary)]">
            Admin Desk
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl text-[var(--primary-strong)]">
            作物管理列表
          </h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            支持按名称过滤，发现乱填数据后可以直接删除。
          </p>
        </div>
        <div className="w-full max-w-sm">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-[var(--primary-strong)]">按名称查看</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="输入作物名称筛选"
              className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--accent)]"
            />
          </label>
        </div>
      </div>

      {errorMessage && (
        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      <div className="mt-5 overflow-hidden rounded-[24px] border border-[var(--border)]">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white/75 text-sm">
            <thead className="bg-[var(--surface-strong)] text-left text-[var(--muted)]">
              <tr>
                <th className="px-4 py-3 font-semibold">名称</th>
                <th className="px-4 py-3 font-semibold">购买价格</th>
                <th className="px-4 py-3 font-semibold">出售总价</th>
                <th className="px-4 py-3 font-semibold">净利润</th>
                <th className="px-4 py-3 font-semibold">经验</th>
                <th className="px-4 py-3 font-semibold">成熟时间</th>
                <th className="px-4 py-3 font-semibold">创建时间</th>
                <th className="px-4 py-3 font-semibold">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredCrops.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-[var(--muted)]">
                    没有匹配的作物记录。
                  </td>
                </tr>
              ) : (
                filteredCrops.map((crop) => (
                  <tr key={crop.id} className="border-t border-[var(--border)] text-[var(--primary-strong)]">
                    <td className="px-4 py-4 font-semibold">{crop.name}</td>
                    <td className="px-4 py-4">{formatNumber(crop.purchasePrice)}</td>
                    <td className="px-4 py-4">{formatNumber(crop.saleTotalPrice)}</td>
                    <td className="px-4 py-4">{formatNumber(crop.profit)}</td>
                    <td className="px-4 py-4">{formatNumber(crop.experienceGain)}</td>
                    <td className="px-4 py-4">
                      <div>{formatMaturityLabel(crop.maturityValue, crop.maturityUnit)}</div>
                      <div className="mt-1 text-xs text-[var(--muted)]">
                        折算 {formatNumber(crop.maturityHours)} 小时
                      </div>
                    </td>
                    <td className="px-4 py-4 text-[var(--muted)]">
                      {new Date(crop.createdAt).toLocaleString("zh-CN")}
                    </td>
                    <td className="px-4 py-4">
                      <button
                        type="button"
                        disabled={busyId === crop.id}
                        onClick={() => handleDelete(crop.id)}
                        className="rounded-full bg-[#7a2b1f] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#612117] disabled:cursor-not-allowed disabled:opacity-65"
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
      </div>
    </section>
  );
}
