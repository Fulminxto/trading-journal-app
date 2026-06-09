import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const publicPaths = [
  "/login",
  "/maintenance",
  "/frozen",
  "/account-review",
];

function isPublicPath(pathname: string) {
  return publicPaths.some(
    (path) =>
      pathname === path ||
      pathname.startsWith(`${path}/`)
  );
}

function isStaticAsset(pathname: string) {
  return (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/icons") ||
    pathname.startsWith("/favicon") ||
    pathname === "/manifest.webmanifest" ||
    pathname === "/sw.js" ||
    pathname.endsWith(".svg") ||
    pathname.endsWith(".png") ||
    pathname.endsWith(".jpg") ||
    pathname.endsWith(".jpeg") ||
    pathname.endsWith(".webp") ||
    pathname.endsWith(".ico")
  );
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    isStaticAsset(pathname) ||
    pathname.startsWith("/api")
  ) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });

  if (!token && !isPublicPath(pathname)) {
    const loginUrl = new URL(
      "/login",
      request.url
    );

    loginUrl.searchParams.set(
      "callbackUrl",
      request.nextUrl.pathname
    );

    return NextResponse.redirect(loginUrl);
  }

  if (token && pathname === "/login") {
    return NextResponse.redirect(
      new URL("/accounts", request.url)
    );
  }

  if (
    token?.status === "FROZEN" &&
    token?.role !== "FOUNDER" &&
    !pathname.startsWith("/account-review")
  ) {
    return NextResponse.redirect(
      new URL("/account-review", request.url)
    );
  }

  if (
    pathname.startsWith("/admin") &&
    token?.role !== "FOUNDER" &&
    token?.role !== "ADMIN"
  ) {
    return NextResponse.redirect(
      new URL("/accounts", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|api/).*)",
  ],
};