import { NextResponse } from "next/server";
import { ApiError } from "./api-error";

export function handleRouteError(err: unknown): NextResponse {
  if (err instanceof ApiError) {
    return NextResponse.json(
      { message: err.message, details: err.data },
      { status: err.status }
    );
  }
  const cause = err instanceof Error && err.cause ? ` — cause: ${err.cause}` : "";
  console.error(`Unexpected BFF error: ${err}${cause}`);
  return NextResponse.json({ message: "Internal server error" }, { status: 500 });
}
