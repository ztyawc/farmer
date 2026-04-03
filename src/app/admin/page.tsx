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
    <main className="fluent-stage">
      <div className="fluent-shell mx-auto max-w-[1440px]">
        <header className="fluent-toolbar">
          <div>
            <div className="fluent-badge w-fit">Moderator Workspace</div>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--foreground)]">
              作物管理后台
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-[var(--foreground-soft)]">
              像系统管理面板一样查看全部作物记录，按名称筛选，并清理乱填或无效的数据。
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/" className="fluent-button fluent-button-secondary">
              返回前台
            </Link>
            <form action={logoutAction}>
              <button type="submit" className="fluent-button">
                退出登录
              </button>
            </form>
          </div>
        </header>

        <section className="p-5">
          <AdminCropsTable initialCrops={crops} />
        </section>
      </div>
    </main>
  );
}
