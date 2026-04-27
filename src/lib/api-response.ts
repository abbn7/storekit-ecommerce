import { NextResponse } from "next/server";
import type { ApiResponse, ApiMeta } from "@/types";

export function apiResponse<T>(data: T, meta?: ApiMeta, status: number = 200) {
  return NextResponse.json(
    {
      data,
      error: null,
      ...(meta ? { meta } : {}),
    } satisfies ApiResponse<T>,
    { status }
  );
}

export function apiError(error: string, status: number = 400) {
  return NextResponse.json(
    {
      data: null,
      error,
    } satisfies ApiResponse<null>,
    { status }
  );
}

export function apiPaginatedResponse<T>(
  data: T[],
  page: number,
  limit: number,
  total: number,
  status: number = 200
) {
  const totalPages = Math.ceil(total / limit);
  return NextResponse.json(
    {
      data,
      error: null,
      meta: {
        page,
        limit,
        total,
        total_pages: totalPages,
      } satisfies ApiMeta,
    },
    { status }
  );
}
