import { createHmac, timingSafeEqual } from "node:crypto";

import { cookies } from "next/headers";

const ADMIN_COOKIE_NAME = "farmer_admin_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7;

function getAuthConfig() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!username || !password || !secret) {
    throw new Error(
      "Missing ADMIN_USERNAME, ADMIN_PASSWORD or ADMIN_SESSION_SECRET environment variables.",
    );
  }

  return { username, password, secret };
}

function safeCompare(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

function signPayload(payload: string, secret: string) {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

function encodeSession(username: string, secret: string) {
  const payload = Buffer.from(
    JSON.stringify({
      username,
      exp: Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS,
    }),
  ).toString("base64url");

  return `${payload}.${signPayload(payload, secret)}`;
}

function decodeSession(token: string, secret: string) {
  const [payload, signature] = token.split(".");

  if (!payload || !signature) {
    return null;
  }

  const expectedSignature = signPayload(payload, secret);

  if (!safeCompare(signature, expectedSignature)) {
    return null;
  }

  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      username?: string;
      exp?: number;
    };

    if (!parsed.username || !parsed.exp || parsed.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function validateAdminCredentials(username: string, password: string) {
  const config = getAuthConfig();

  return (
    safeCompare(username.trim(), config.username.trim()) &&
    safeCompare(password, config.password)
  );
}

export async function createAdminSession() {
  const cookieStore = await cookies();
  const { username, secret } = getAuthConfig();

  cookieStore.set(ADMIN_COOKIE_NAME, encodeSession(username, secret), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
}

export async function hasAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  if (!token) {
    return false;
  }

  const { username, secret } = getAuthConfig();
  const session = decodeSession(token, secret);

  return Boolean(session?.username && safeCompare(session.username, username));
}
