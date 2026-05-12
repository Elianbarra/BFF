import { AuthService } from "@/features/auth/auth.service";
import { handleRouteError } from "@/lib/route-handler";
import { NextRequest, NextResponse } from "next/server";

const authService = new AuthService();

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token");
    if (!token) {
      return NextResponse.json({ message: "token query param is required" }, { status: 400 });
    }
    const result = await authService.validateToken(token);
    return NextResponse.json(result);
  } catch (err) {
    return handleRouteError(err);
  }
}
