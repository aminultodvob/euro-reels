import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
    const isLoginPage = req.nextUrl.pathname === "/admin/login";
    const isSignupPage = req.nextUrl.pathname === "/admin/signup";

    if (isAdminRoute && !isLoginPage && !isSignupPage) {
      if (!token) {
        console.log(`[Middleware] No token found for ${req.nextUrl.pathname}`);
        return NextResponse.redirect(new URL("/admin/login", req.url));
      }
      
      if (token.role !== "ADMIN") {
        console.log(`[Middleware] Unauthorized role for ${req.nextUrl.pathname}`);
        return NextResponse.redirect(new URL("/admin/login", req.url));
      }
    }

    if ((isLoginPage || isSignupPage) && token) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const isLoginPage = req.nextUrl.pathname === "/admin/login";
        const isSignupPage = req.nextUrl.pathname === "/admin/signup";
        if (isLoginPage || isSignupPage) return true;
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*"],
};
