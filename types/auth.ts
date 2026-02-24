export interface JWTPayload {
  sub: string; // User ID
  email: string;
  role: 'admin' | 'user';
}
