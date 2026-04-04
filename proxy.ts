import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
  const isLoginPage = req.nextUrl.pathname.startsWith("/login");

  const authCookie = req.cookies.get("rofi_admin_auth");

  if (isAdminRoute && !authCookie) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isLoginPage && authCookie) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};