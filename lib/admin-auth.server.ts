import "server-only";

import {
  createHmac,
  timingSafeEqual,
} from "node:crypto";

import {
  cookies,
} from "next/headers";
import { redirect } from "next/navigation";

const ADMIN_SESSION_COOKIE = "anza_admin_session";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7;

function getAdminCredentials() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.ANZA_SECRET;

  if (!username || !password || !secret) {
    throw new Error("ADMIN_USERNAME, ADMIN_PASSWORD, and ANZA_SECRET must be configured.");
  }

  return { username, password, secret };
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

function signSessionValue(value: string, secret: string) {
  return createHmac("sha256", secret).update(value).digest("hex");
}

function createSessionToken(username: string, secret: string) {
  const expiresAt = Date.now() + SESSION_DURATION_MS;
  const payload = `${username}:${expiresAt}`;
  const signature = signSessionValue(payload, secret);

  return `${payload}:${signature}`;
}

function parseSessionToken(token: string, secret: string) {
  const parts = token.split(":");

  if (parts.length < 3) {
    return null;
  }

  const signature = parts.pop();
  const expiresAt = parts.pop();
  const username = parts.join(":");

  if (!signature || !expiresAt || !username) {
    return null;
  }

  const payload = `${username}:${expiresAt}`;
  const expectedSignature = signSessionValue(payload, secret);

  if (!safeEqual(signature, expectedSignature)) {
    return null;
  }

  if (Date.now() > Number(expiresAt)) {
    return null;
  }

  return { username };
}

export function validateAdminCredentials(username: string, password: string) {
  const credentials = getAdminCredentials();

  return (
    safeEqual(username, credentials.username) &&
    safeEqual(password, credentials.password)
  );
}

export async function createAdminSession() {
  const cookieStore = await cookies();
  const { username, secret } = getAdminCredentials();

  cookieStore.set(ADMIN_SESSION_COOKIE, createSessionToken(username, secret), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DURATION_MS / 1000,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!token) {
    return false;
  }

  const { secret } = getAdminCredentials();

  return Boolean(parseSessionToken(token, secret));
}

export async function requireAdminAuth() {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    redirect("/admin/login");
  }
}
