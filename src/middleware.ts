import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAuth } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Public paths that don't require authentication
  const publicPaths = ["/login", "/api/auth/login"];

  if (publicPaths.includes(path)) {
    return NextResponse.next();
  }

  // Check authentication for protected paths
  const session = await verifyAuth(request);

  if (!session && path.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (
    !session &&
    path.startsWith("/api") &&
    !path.startsWith("/api/auth/login")
  ) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
