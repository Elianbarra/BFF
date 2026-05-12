export type DocumentType = "DNI" | "PASSPORT" | "FOREIGN_ID" | "RUC";
export type UserRole = "PATIENT" | "DOCTOR" | "NURSE" | "ADMIN" | "RECEPTIONIST";

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  documentType: DocumentType;
  documentNumber: string;
  role: UserRole;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  documentType?: DocumentType;
  documentNumber?: string;
  role?: UserRole;
}

export interface UserResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  documentType: DocumentType;
  documentNumber: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
}

export interface IUsersRepository {
  register(data: CreateUserRequest): Promise<UserResponse>;
  getAll(): Promise<UserResponse[]>;
  getById(id: string): Promise<UserResponse>;
  update(id: string, data: UpdateUserRequest): Promise<UserResponse>;
  deactivate(id: string): Promise<void>;
}
