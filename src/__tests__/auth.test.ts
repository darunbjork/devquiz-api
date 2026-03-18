
import { describe, expect, test, vi, beforeEach } from 'vitest';
import { userRepository } from '../repository/user.ts';
import { NotFoundError } from '../errors.ts';
import type { UserDoc } from '../types/db.ts';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { UnauthorizedError as _UnauthorizedError, ForbiddenError as _ForbiddenError } from '../errors.ts'; // Import these errors
import type { JWTPayload } from '../types/auth.ts';

vi.mock('../repository/user.ts', () => ({
  userRepository: {
    create: vi.fn(),
    findByEmail: vi.fn(),
    findById: vi.fn(),
    update: vi.fn(),
  },
}));

vi.mock('../utils/transform.ts', () => ({
  transformAttempt: vi.fn(attempt => attempt),
  transformQuiz: vi.fn(quiz => quiz),
  transformUser: vi.fn(user => user),
}));

describe('authService.updateUserRole', async () => {
  const { authService } = await import('../services/auth.ts');

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should successfully update a user\'s role', async () => {
    const mockUserId = '65d215d2a93b4a2f8b9d3110';
    const newRole = 'admin';
    const mockUpdatedUser: UserDoc = {
      _id: new (await import('mongodb')).ObjectId(mockUserId),
      createdAt: new Date(),
      email: 'test@example.com',
      passwordHash: 'hashedpassword',
      role: newRole,
      settings: { theme: 'light' },
      username: 'testuser',
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

const mockRequest = (params: { userId: string }, body: { role: 'admin' | 'user' }, user: JWTPayload | null = null) => ({
  body,
  params,
  user,
} as FastifyRequest<{ Params: { userId: string }; Body: { role: 'admin' | 'user' } }>);

const mockReply = () => {
  const reply: Partial<FastifyReply> = {
    code: vi.fn().mockReturnThis(),
    send: vi.fn().mockReturnThis(),
  };
  return reply as FastifyReply;
};

describe('authController.updateUserRole API', async () => { 
  vi.mock('../services/auth.ts', () => ({
    authService: {
      getMe: vi.fn(),
      login: vi.fn(),
      register: vi.fn(),
      updateProfile: vi.fn(),
      updateUserRole: vi.fn(),
    },
  }));

  const { authController } = await import('../controllers/auth.ts');
  const { authService } = await import('../services/auth.ts');

  const adminUserId = 'admin123';
  const normalUserId = 'user456';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should successfully update a user role by admin', async () => {
    const mockAdminUser = { email: 'admin@example.com', role: 'admin' as const, sub: adminUserId }; 
    const mockTargetUser = { id: normalUserId, role: 'user' };
    const newRole = 'admin';

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
    const mockAdminUser = { email: 'admin@example.com', role: 'admin' as const, sub: adminUserId };
    const nonExistentUserId = 'nonexistent';
    const newRole = 'user';

    (authService.updateUserRole as import('vitest').Mock).mockRejectedValue(new NotFoundError('User not found'));

    const req = mockRequest({ userId: nonExistentUserId }, { role: newRole }, mockAdminUser);
    const reply = mockReply();

    await expect(authController.updateUserRole(req, reply)).rejects.toThrow(NotFoundError);
    expect(authService.updateUserRole).toHaveBeenCalledWith(nonExistentUserId, newRole);
    expect(reply.code).not.toHaveBeenCalled(); 
  });
});
