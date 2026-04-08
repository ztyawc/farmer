"use server";

import { redirect } from "next/navigation";

import { createAdminSession, validateAdminCredentials } from "@/lib/admin-auth";

export type LoginActionState = {
  error: string;
};

export async function loginAction(
  _previousState: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!username.trim() || !password) {
    return {
      error: "请输入完整的账号和密码。",
    };
  }

  if (!validateAdminCredentials(username, password)) {
    return {
      error: "账号或密码不正确。",
    };
  }

  await createAdminSession();
  redirect("/admin");
}
