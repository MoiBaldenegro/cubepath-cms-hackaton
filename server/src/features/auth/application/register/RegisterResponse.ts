export interface RegisterResponse {
  user: {
    id: string;
    email: string;
    token?: string;
  };
}
