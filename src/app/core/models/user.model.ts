import { UserRoleEnum } from '../enums/user-role.enum';

export interface RegisterData {
  email: string;
  password: string;
}

export interface AuthResponse {
  role: UserRoleEnum;
  accessToken: string;
  refreshToken: string;
}
