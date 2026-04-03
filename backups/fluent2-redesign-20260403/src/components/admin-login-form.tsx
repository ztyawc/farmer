"use client";

import { useActionState } from "react";

import { loginAction, type LoginActionState } from "@/app/admin/login/actions";

const initialState: LoginActionState = {
  error: "",
};

export function AdminLoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="mt-8 grid gap-4">
      <label className="space-y-2">
        <span className="text-sm font-semibold text-[var(--primary-strong)]">管理员账号</span>
        <input
          required
          name="username"
          className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--accent)]"
          placeholder="输入管理员账号"
        />
      </label>

      <label className="space-y-2">
        <span className="text-sm font-semibold text-[var(--primary-strong)]">管理员密码</span>
        <input
          required
          type="password"
          name="password"
          className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--accent)]"
          placeholder="输入管理员密码"
        />
      </label>

      {state.error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="mt-2 rounded-full bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--primary-strong)] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? "登录中..." : "登录后台"}
      </button>
    </form>
  );
}
