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
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <section className="glass-panel w-full max-w-md rounded-[30px] p-6 sm:p-8">
        <p className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--primary)]">
          Admin Access
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-semibold text-[var(--primary-strong)]">
          登录管理后台
        </h1>
        <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
          使用环境变量中配置的管理员账号登录，登录后可以删除乱填的作物数据。
        </p>

        <AdminLoginForm />
      </section>
    </main>
  );
}
