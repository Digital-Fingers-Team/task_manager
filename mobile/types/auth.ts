export interface UserProfile {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface AuthSession {
  userId: string;
  name: string;
  email: string;
  token: string;
  startedAt: string;
}

export interface AuthResult {
  success: boolean;
  message?: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}
