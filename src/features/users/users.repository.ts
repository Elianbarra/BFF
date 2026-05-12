import { env } from "@/lib/env";
import { httpDelete, httpGet, httpPost, httpPut } from "@/lib/http-client";
import type {
  CreateUserRequest,
  IUsersRepository,
  UpdateUserRequest,
  UserResponse,
} from "./users.types";

export class UsersRepository implements IUsersRepository {
  private readonly baseUrl = env.msUserUrl;

  async register(data: CreateUserRequest): Promise<UserResponse> {
    return httpPost<UserResponse>(`${this.baseUrl}/api/users/register`, data);
  }

  async getAll(): Promise<UserResponse[]> {
    return httpGet<UserResponse[]>(`${this.baseUrl}/api/users`);
  }

  async getById(id: string): Promise<UserResponse> {
    return httpGet<UserResponse>(`${this.baseUrl}/api/users/${id}`);
  }

  async update(id: string, data: UpdateUserRequest): Promise<UserResponse> {
    return httpPut<UserResponse>(`${this.baseUrl}/api/users/${id}`, data);
  }

  async deactivate(id: string): Promise<void> {
    return httpDelete(`${this.baseUrl}/api/users/${id}`);
  }
}
