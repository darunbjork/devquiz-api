// Step 10: Implement the authentication service that provides methods for user registration and login. The register method checks if the email is already registered, hashes the password using the hashPassword function, and creates a new user in the database. The login method retrieves the user by email, verifies the password using the comparePassword function, and returns the user if authentication is successful. If any validation fails during registration or login, appropriate errors are thrown to inform the client of the issue.
import { userRepository } from '../repository/user.ts';
import { hashPassword, comparePassword } from '../utils/password.ts';
import { ConflictError, UnauthorizedError } from '../errors.ts';
import type { RegisterBody, LoginBody } from '../types/http.ts';

export const authService = {
  async login(data: LoginBody) {
    const user = await userRepository.findByEmail(data.email);
    if (!user || !(await comparePassword(user.passwordHash, data.password))) {
      throw new UnauthorizedError('Invalid email or password');
    }
    return user;
  },

  async register(data: RegisterBody) {
    const existing = await userRepository.findByEmail(data.email);
    if (existing) throw new ConflictError('Email already registered');

    const hashedPassword = await hashPassword(data.password);
    return await userRepository.create({
      createdAt: new Date(),
      email: data.email,
      passwordHash: hashedPassword,
      role: 'user',
      username: data.username
    });
  }
};
