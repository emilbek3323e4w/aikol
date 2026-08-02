import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/shared/i18n/routing";
import { auth } from "@/shared/lib/auth";

const intlMiddleware = createMiddleware(routing);

const ADMIN_PATH_RE = /^\/(ru|kg)\/admin(?!\/login)/;

export default auth((req: NextRequest & { auth?: unknown }) => {
  const { pathname } = req.nextUrl;

  if (ADMIN_PATH_RE.test(pathname) && !req.auth) {
    const locale = pathname.split("/")[1];
    return NextResponse.redirect(
      new URL(`/${locale}/admin/login`, req.url),
    );
  }

  return intlMiddleware(req);
});

export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};
