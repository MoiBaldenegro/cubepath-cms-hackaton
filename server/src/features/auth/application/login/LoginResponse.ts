export interface LoginResponse {
  user: {
    id: string;
    email: string;
    role: string;
  };
  token: string;
}
