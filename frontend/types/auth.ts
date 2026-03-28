export type AuthProfile = {
  userId?: string;
  username?: string;
  role?: string;
  sub?: string;
  exp?: number;
  iat?: number;
};

export type SignUpRequest = {
  userName: string;
  password: string;
};

export type LogInRequest = {
  username: string;
  password: string;
};
