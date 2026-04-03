import Link from "next/link";
import { redirect } from "next/navigation";

import { logoutAction } from "@/app/admin/actions";
import { AdminCropsTable } from "@/components/admin-crops-table";
import { hasAdminSession } from "@/lib/admin-auth";
import { getCrops } from "@/lib/crop-service";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const isAdmin = await hasAdminSession();

  if (!isAdmin) {
    redirect("/admin/login");
  }

  const crops = await getCrops("profit_per_hour");

  return (
    <main className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <section className="glass-panel rounded-[30px] p-6 sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--primary)]">
                Moderation
              </p>
              <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl font-semibold text-[var(--primary-strong)]">
                作物管理后台
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">
                这里用于处理乱填或无效的作物数据。删除后会立即从公开榜单和数据库中移除。
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/"
                className="rounded-full border border-[var(--border)] bg-white/75 px-5 py-3 text-sm font-semibold text-[var(--primary-strong)] transition hover:bg-white"
              >
                返回前台
              </Link>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="rounded-full bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--primary-strong)]"
                >
                  退出登录
                </button>
              </form>
            </div>
          </div>
        </section>

        <AdminCropsTable initialCrops={crops} />
      </div>
    </main>
  );
}
