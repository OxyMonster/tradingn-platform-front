export interface User {
  id: number;
  email: string;
  role: 'admin' | 'worker' | 'support' | 'user';
  gender?: string;
  full_name: string;
  is_verified: boolean;
  is_vip: boolean;
  is_banned: boolean;
  security_level: number;
  profile_picture?: string;
  referral_code: string;
  overall_balance: number;
  created_at: string;
  last_login?: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user: User;
  tokens: AuthTokens;
}

export interface RegisterRequest {
  email: string;
  password: string;
  password_confirm: string;
  gender?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}
