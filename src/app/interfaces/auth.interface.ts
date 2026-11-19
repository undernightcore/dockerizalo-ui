export interface LoginRequestInterface {
  email: string;
  password: string;
}

export interface RegisterRequestInterface extends LoginRequestInterface {
  name: string;
}

export interface TokenInterface {
  token: string;
}

export type UserRole = 'USER' | 'ADMIN';

export interface UserInterface {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface EditUserRequestInterface {
  name?: string;
  email?: string;
  password?: string;
  role?: UserRole;
}
