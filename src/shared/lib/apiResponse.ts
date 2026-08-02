import { NextResponse } from "next/server";

export function apiSuccess<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ success: true, data }, init);
}

export function apiError(
  code: string,
  message: string,
  status: number,
) {
  return NextResponse.json(
    { success: false, error: { code, message } },
    { status },
  );
}
