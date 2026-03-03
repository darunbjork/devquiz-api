/* eslint-disable perfectionist/sort-objects */
import { describe, expect, test, vi, beforeEach } from 'vitest';
import { userRepository } from '../repository/user.ts';
import { NotFoundError } from '../errors.ts';
import type { UserDoc } from '../types/db.ts';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { UnauthorizedError as _UnauthorizedError, ForbiddenError as _ForbiddenError } from '../errors.ts'; // Import these errors
import type { JWTPayload } from '../types/auth.ts';

// Mock userRepository
vi.mock('../repository/user.ts', () => ({
  userRepository: {
    update: vi.fn(),
    findById: vi.fn(),
    findByEmail: vi.fn(),
    create: vi.fn(),
  },
}));

// Mock transformUser to return the input directly for simpler testing
vi.mock('../utils/transform.ts', () => ({
  transformUser: vi.fn(user => user),
  transformQuiz: vi.fn(quiz => quiz),
  transformAttempt: vi.fn(attempt => attempt),
}));

describe('authService.updateUserRole', async () => {
  // Import authService here, after its dependencies are mocked
  const { authService } = await import('../services/auth.ts');

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should successfully update a user\'s role', async () => {
    const mockUserId = '65d215d2a93b4a2f8b9d3110';
    const newRole = 'admin';
    const mockUpdatedUser: UserDoc = {
      _id: new (await import('mongodb')).ObjectId(mockUserId),
      username: 'testuser',
      email: 'test@example.com',
      passwordHash: 'hashedpassword',
      role: newRole,
      createdAt: new Date(),
      settings: { theme: 'light' },
    };

    (userRepository.update as import('vitest').Mock).mockResolvedValue(mockUpdatedUser);

    const result = await authService.updateUserRole(mockUserId, newRole);

    expect(userRepository.update).toHaveBeenCalledWith(mockUserId, { role: newRole });
    expect(result).toEqual(mockUpdatedUser);
  });

  test('should throw NotFoundError if user is not found', async () => {
    const mockUserId = 'nonexistentid';
    const newRole = 'admin';

    (userRepository.update as import('vitest').Mock).mockResolvedValue(null);

    await expect(authService.updateUserRole(mockUserId, newRole)).rejects.toThrow(NotFoundError);
    expect(userRepository.update).toHaveBeenCalledWith(mockUserId, { role: newRole });
  });
});

// Mock FastifyRequest and FastifyReply
const mockRequest = (params: { userId: string }, body: { role: 'admin' | 'user' }, user: JWTPayload | null = null) => ({
  params,
  body,
  user,
} as FastifyRequest<{ Params: { userId: string }; Body: { role: 'admin' | 'user' } }>);

const mockReply = () => {
  const reply: Partial<FastifyReply> = {
    code: vi.fn().mockReturnThis(),
    send: vi.fn().mockReturnThis(),
  };
  return reply as FastifyReply;
};

describe('authController.updateUserRole API', async () => { // Changed describe name to avoid conflict
  // Mock authService specifically for this describe block
  vi.mock('../services/auth.ts', () => ({
    authService: {
      login: vi.fn(),
      register: vi.fn(),
      getMe: vi.fn(),
      updateProfile: vi.fn(),
      updateUserRole: vi.fn(),
    },
  }));
  // Import authController here, after its dependencies are mocked
  const { authController } = await import('../controllers/auth.ts');
  // Import authService again to use its mocked version within this block
  const { authService } = await import('../services/auth.ts');

  const adminUserId = 'admin123';
  const normalUserId = 'user456';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should successfully update a user role by admin', async () => {
    const mockAdminUser = { sub: adminUserId, email: 'admin@example.com', role: 'admin' as const }; // This user object represents the authenticated admin
    const mockTargetUser = { id: normalUserId, role: 'user' };
    const newRole = 'admin';

    // Mock authService.updateUserRole to return the updated user
    (authService.updateUserRole as import('vitest').Mock).mockResolvedValue({ ...mockTargetUser, role: newRole });

    const req = mockRequest({ userId: normalUserId }, { role: newRole }, mockAdminUser);
    const reply = mockReply();

    const result = await authController.updateUserRole(req, reply);

    expect(authService.updateUserRole).toHaveBeenCalledWith(normalUserId, newRole);
    expect(result).toEqual({ message: 'User role updated successfully', user: { ...mockTargetUser, role: newRole } });
    expect(reply.code).not.toHaveBeenCalled();
    expect(reply.send).not.toHaveBeenCalled();
  });

  test('should throw NotFoundError if user to update is not found', async () => {
    const mockAdminUser = { sub: adminUserId, email: 'admin@example.com', role: 'admin' as const };
    const nonExistentUserId = 'nonexistent';
    const newRole = 'user';

    // Mock authService.updateUserRole to reject with NotFoundError
    (authService.updateUserRole as import('vitest').Mock).mockRejectedValue(new NotFoundError('User not found'));

    const req = mockRequest({ userId: nonExistentUserId }, { role: newRole }, mockAdminUser);
    const reply = mockReply();

    await expect(authController.updateUserRole(req, reply)).rejects.toThrow(NotFoundError);
    expect(authService.updateUserRole).toHaveBeenCalledWith(nonExistentUserId, newRole);
    expect(reply.code).not.toHaveBeenCalled(); // Error is thrown, not sent via reply.code/send
  });
});
