import { AuthService } from "@/features/auth/auth.service";
import { handleRouteError } from "@/lib/route-handler";
import { NextRequest, NextResponse } from "next/server";

const authService = new AuthService();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ message: "Request body is required" }, { status: 400 });
    }
    const result = await authService.login(body);
    return NextResponse.json(result);
  } catch (err) {
    return handleRouteError(err);
  }
}
