import Link from "next/link";
import { redirect } from "next/navigation";

import { logoutAction } from "@/app/admin/actions";
import { AdminCropsTable } from "@/components/admin-crops-table";
import {
  buildAdminCropListHref,
  parseAdminCropListParams,
} from "@/lib/admin-crop-list";
import { hasAdminSession } from "@/lib/admin-auth";
import { getAdminCropList } from "@/lib/crop-service";

export const dynamic = "force-dynamic";

type AdminPageSearchParams = Promise<{
  query?: string | string[] | undefined;
  page?: string | string[] | undefined;
  sort?: string | string[] | undefined;
}>;

function takeFirstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: AdminPageSearchParams;
}) {
  const isAdmin = await hasAdminSession();

  if (!isAdmin) {
    redirect("/admin/login");
  }

  const resolvedSearchParams = await searchParams;
  const listParams = parseAdminCropListParams(resolvedSearchParams);
  const listResult = await getAdminCropList(listParams);

  const rawQuery = takeFirstValue(resolvedSearchParams.query)?.trim() ?? "";
  const rawPage = takeFirstValue(resolvedSearchParams.page);
  const rawSort = takeFirstValue(resolvedSearchParams.sort);
  const canonicalHref = buildAdminCropListHref({
    query: listResult.query,
    page: listResult.currentPage,
    sort: listResult.sort,
  });
  const shouldRedirect =
    rawQuery !== listResult.query ||
    (rawPage !== undefined && rawPage !== String(listResult.currentPage)) ||
    (rawSort !== undefined && rawSort !== listResult.sort);

  if (shouldRedirect) {
    redirect(canonicalHref);
  }

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
              这里用于审核和维护作物数据。你可以按名称搜索、切换排序、分页查看，并直接编辑或删除不准确的记录。
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
          <AdminCropsTable initialResult={listResult} />
        </section>
      </div>
    </main>
  );
}
