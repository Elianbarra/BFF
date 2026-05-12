import { env } from "@/lib/env";
import { httpGet, httpPost } from "@/lib/http-client";
import type {
  AuthResponse,
  IAuthRepository,
  LoginRequest,
  TokenValidationResponse,
} from "./auth.types";

export class AuthRepository implements IAuthRepository {
  private readonly baseUrl = env.msAuthUrl;

  async login(data: LoginRequest): Promise<AuthResponse> {
    return httpPost<AuthResponse>(`${this.baseUrl}/api/auth/login`, data);
  }

  async validateToken(token: string): Promise<TokenValidationResponse> {
    return httpGet<TokenValidationResponse>(
      `${this.baseUrl}/api/auth/validate?token=${encodeURIComponent(token)}`
    );
  }
}
