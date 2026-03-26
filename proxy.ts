import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
  const isLoginPage = req.nextUrl.pathname.startsWith("/login");

  const authCookie = req.cookies.get("rofi_admin_auth");

  // Se NON è autenticato e vuole entrare in /admin → mandalo al login
  if (isAdminRoute && !authCookie) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Se è autenticato e prova ad andare su /login → mandalo in admin
  if (isLoginPage && authCookie) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};