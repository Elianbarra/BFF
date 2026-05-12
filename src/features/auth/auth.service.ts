import { AuthRepository } from "./auth.repository";
import type { AuthResponse, IAuthRepository, LoginRequest, TokenValidationResponse } from "./auth.types";

export class AuthService {
  constructor(private readonly repository: IAuthRepository = new AuthRepository()) {}

  login(data: LoginRequest): Promise<AuthResponse> {
    return this.repository.login(data);
  }

  validateToken(token: string): Promise<TokenValidationResponse> {
    return this.repository.validateToken(token);
  }
}
