import { redirect } from "next/navigation";

import { AdminLoginForm } from "@/components/admin-login-form";
import { hasAdminSession } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const isAdmin = await hasAdminSession();

  if (isAdmin) {
    redirect("/admin");
  }

  return (
    <main className="fluent-stage flex items-center justify-center">
      <div className="grid w-full max-w-6xl gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="fluent-shell p-8 sm:p-10">
          <div className="fluent-badge w-fit">Fluent 2 Admin Access</div>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-[var(--foreground)] sm:text-5xl">
            登录管理后台
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-[var(--foreground-soft)]">
            这里是维护作物数据的系统入口。登录后可以搜索记录、编辑错误数据，并保持前台榜单内容准确可靠。
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <section className="fluent-panel p-5">
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--foreground-soft)]">
                入口定位
              </div>
              <div className="mt-3 text-lg font-semibold text-[var(--foreground)]">
                系统级管理面板
              </div>
              <p className="mt-2 text-sm leading-7 text-[var(--foreground-soft)]">
                与主站共享 Fluent 2 视觉语言，保持 Windows 风格的一体化系统感。
              </p>
            </section>

            <section className="fluent-panel p-5">
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--foreground-soft)]">
                安全边界
              </div>
              <div className="mt-3 text-lg font-semibold text-[var(--foreground)]">
                单管理员凭证访问
              </div>
              <p className="mt-2 text-sm leading-7 text-[var(--foreground-soft)]">
                使用环境变量中的管理员账号和密码登录，未登录用户不能访问后台管理页面或接口。
              </p>
            </section>
          </div>
        </section>

        <section className="fluent-shell overflow-hidden">
          <div className="fluent-toolbar">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--foreground-soft)]">
                Sign In
              </div>
              <h2 className="mt-2 text-2xl font-semibold text-[var(--foreground)]">
                管理员身份验证
              </h2>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <AdminLoginForm />
          </div>
        </section>
      </div>
    </main>
  );
}
