import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Check if it's a tenant route (and not an API route which has its own auth checks)
  if (pathname.startsWith("/tenant") && !pathname.startsWith("/tenant-login") && !pathname.startsWith("/api")) {
    const token = request.cookies.get("tenant_session")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/tenant-login", request.url));
    }

    try {
      const secret = process.env.JWT_SECRET_KEY || 'fallback-pilas-tenant-secret-key-32chars';
      const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));

      // Force change passcode if required
      if (
        payload.must_change_pass === true && 
        pathname !== "/tenant/settings/change-passcode"
      ) {
        return NextResponse.redirect(new URL("/tenant/settings/change-passcode", request.url));
      }

    } catch (err) {
      // Invalid/expired token
      return NextResponse.redirect(new URL("/tenant-login", request.url));
    }
  }

  // 2. Default Supabase auth session update for admin routes
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
