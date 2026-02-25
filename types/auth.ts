// Step 4: in a concise sentence, define a TypeScript interface for the payload of the JSON Web Token (JWT) used in the authentication process. This interface specifies the expected structure of the data contained in the JWT, such as the user ID (sub), email, and role. It helps ensure type safety when working with JWTs in the application.
export interface JWTPayload {
  sub: string; // User ID
  email: string;
  role: 'admin' | 'user';
}
