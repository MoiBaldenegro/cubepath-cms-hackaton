export interface LoginResponse {
  user: {
    id: string;
    email: string;
    role: string;
    organizationId: string;
  };
  token: string;
}
