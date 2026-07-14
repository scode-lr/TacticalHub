export interface SignInRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignUpRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  birthDate?: string;
  username?: string;
}

export interface SocialAuthRequest {
  provider: 'google' | 'apple';
  token: string;
  email?: string;
  firstName?: string;
  lastName?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}