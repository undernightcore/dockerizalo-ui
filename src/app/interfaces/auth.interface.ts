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
