import { apiSuccess } from "@/shared/lib/apiResponse";

export async function GET() {
  const email = process.env.ADMIN_EMAIL;
  const hash = process.env.ADMIN_PASSWORD_HASH;
  const secret = process.env.AUTH_SECRET;
  const nextauthUrl = process.env.NEXTAUTH_URL;

  return apiSuccess({
    hasEmail: !!email,
    emailLength: email?.length ?? 0,
    emailTrimmedEqualsRaw: email ? email === email.trim() : null,
    hasHash: !!hash,
    hashLength: hash?.length ?? 0,
    hashPrefix: hash?.slice(0, 7) ?? null,
    hashHasBackslash: hash ? hash.includes("\\") : null,
    hashTrimmedEqualsRaw: hash ? hash === hash.trim() : null,
    hasSecret: !!secret,
    nextauthUrl: nextauthUrl ?? null,
  });
}
