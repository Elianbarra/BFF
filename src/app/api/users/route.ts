import { UsersService } from "@/features/users/users.service";
import { handleRouteError } from "@/lib/route-handler";
import { NextRequest, NextResponse } from "next/server";

const usersService = new UsersService();

export async function GET() {
  try {
    const users = await usersService.getAll();
    return NextResponse.json(users);
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ message: "Request body is required" }, { status: 400 });
    }
    const user = await usersService.register(body);
    return NextResponse.json(user, { status: 201 });
  } catch (err) {
    return handleRouteError(err);
  }
}
