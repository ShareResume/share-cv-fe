export interface RegisterData {
  email: string;
  password: string;
 // confirmPassword: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}
