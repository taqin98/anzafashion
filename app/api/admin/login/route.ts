import { NextResponse } from "next/server";

import {
  createAdminSession,
  validateAdminCredentials,
} from "@/lib/admin-auth.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as {
      username?: string;
      password?: string;
    };

    const username = String(payload.username || "").trim();
    const password = String(payload.password || "");

    if (!validateAdminCredentials(username, password)) {
      return NextResponse.json(
        {
          ok: false,
          message: "Username atau password salah.",
        },
        { status: 401 },
      );
    }

    await createAdminSession();

    return NextResponse.json({
      ok: true,
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        message: "Login gagal diproses.",
      },
      { status: 400 },
    );
  }
}
