import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (
      username === process.env.ADMIN_USER &&
      password === process.env.ADMIN_PASS
    ) {
      const response = NextResponse.json({ success: true });

      response.cookies.set("rofi_admin_auth", "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 8,
      });

      return response;
    }

    return NextResponse.json(
      { error: "Credenziali errate" },
      { status: 401 },
    );
  } catch {
    return NextResponse.json(
      { error: "Errore durante il login" },
      { status: 500 },
    );
  }
}