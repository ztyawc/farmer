"use client";

import { useActionState } from "react";

import { loginAction, type LoginActionState } from "@/app/admin/login/actions";

const initialState: LoginActionState = {
  error: "",
};

export function AdminLoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="grid gap-5">
      <label className="space-y-2">
        <span className="text-sm font-semibold text-[var(--foreground)]">管理员账号</span>
        <input
          required
          name="username"
          className="fluent-input"
          placeholder="输入管理员账号"
        />
      </label>

      <label className="space-y-2">
        <span className="text-sm font-semibold text-[var(--foreground)]">管理员密码</span>
        <input
          required
          type="password"
          name="password"
          className="fluent-input"
          placeholder="输入管理员密码"
        />
      </label>

      {state.error && (
        <div className="rounded-[18px] border border-[rgba(196,43,28,0.16)] bg-[rgba(196,43,28,0.08)] px-4 py-3 text-sm text-[var(--danger)]">
          {state.error}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="fluent-button mt-2 w-full disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? "登录中..." : "登录后台"}
      </button>
    </form>
  );
}
