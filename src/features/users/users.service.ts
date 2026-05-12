import { UsersRepository } from "./users.repository";
import type {
  CreateUserRequest,
  IUsersRepository,
  UpdateUserRequest,
  UserResponse,
} from "./users.types";

export class UsersService {
  constructor(private readonly repository: IUsersRepository = new UsersRepository()) {}

  register(data: CreateUserRequest): Promise<UserResponse> {
    return this.repository.register(data);
  }

  getAll(): Promise<UserResponse[]> {
    return this.repository.getAll();
  }

  getById(id: string): Promise<UserResponse> {
    return this.repository.getById(id);
  }

  update(id: string, data: UpdateUserRequest): Promise<UserResponse> {
    return this.repository.update(id, data);
  }

  deactivate(id: string): Promise<void> {
    return this.repository.deactivate(id);
  }
}
