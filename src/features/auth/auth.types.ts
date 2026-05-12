export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  userId: string;
  email: string;
  role: string;
}

export interface TokenValidationResponse {
  valid: boolean;
  email: string;
  role: string;
  userId: string;
}

export interface IAuthRepository {
  login(data: LoginRequest): Promise<AuthResponse>;
  validateToken(token: string): Promise<TokenValidationResponse>;
}
