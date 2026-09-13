import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../../db';
import { generateAccessToken, generateRefreshToken } from '../../utils/jwt';
import { sendSuccess, sendError } from '../../utils/response';
import { AuthRequest } from '../../middleware/auth.middleware';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password, expectedRole } = req.body;

    if (!email || !password) {
      return sendError(res, 'Email and password are required', 400);
    }

    const user = await prisma.user.findFirst({
      where: {
        email: email.trim().toLowerCase(),
        isActive: true,
        isSuspended: false,
      },
    });

    if (!user) {
      return sendError(res, 'Invalid credentials or account suspended', 401);
    }

    if (expectedRole && user.role !== expectedRole.toUpperCase()) {
      return sendError(res, `Account role mismatch. Expected ${expectedRole}`, 403);
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return sendError(res, 'Invalid credentials', 401);
    }

    const tokenPayload = {
      userId: user.id,
      role: user.role,
      ownerId: user.ownerId,
      email: user.email,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Record session
    await prisma.userSession.create({
      data: {
        userId: user.id,
        refreshToken,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        ipAddress: req.ip || '',
        userAgent: req.get('user-agent') || '',
      },
    });

    // Record audit log
    await prisma.auditLog.create({
      data: {
        actorId: user.id,
        ownerId: user.ownerId,
        action: 'USER_LOGIN',
        entityType: 'User',
        entityId: user.id,
        details: JSON.stringify({ ip: req.ip, role: user.role }),
      },
    });

    return sendSuccess(res, 'Login successful', {
      user: {
        id: user.id,
        name: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role.toLowerCase(),
        ownerId: user.ownerId,
        mustChangePassword: user.mustChangePassword,
      },
      accessToken,
      refreshToken,
    });
  } catch (error: any) {
    return sendError(res, error.message || 'Login failed', 500, error);
  }
};

export const logout = async (req: AuthRequest, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) {
      await prisma.userSession.updateMany({
        where: { refreshToken },
        data: { isRevoked: true },
      });
    }
    return sendSuccess(res, 'Logged out successfully');
  } catch (error: any) {
    return sendError(res, 'Logout failed', 500, error);
  }
};

export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return sendError(res, 'Unauthenticated', 401);
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        role: true,
        ownerId: true,
        mustChangePassword: true,
        avatarUrl: true,
        isActive: true,
      },
    });

    if (!user) return sendError(res, 'User not found', 404);

    return sendSuccess(res, 'User fetched successfully', {
      id: user.id,
      name: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role.toLowerCase(),
      ownerId: user.ownerId,
      mustChangePassword: user.mustChangePassword,
    });
  } catch (error: any) {
    return sendError(res, 'Failed to fetch current user', 500, error);
  }
};

export const changePassword = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return sendError(res, 'Unauthenticated', 401);
    const { oldPassword, newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return sendError(res, 'New password must be at least 6 characters', 400);
    }

    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    if (!user) return sendError(res, 'User not found', 404);

    if (oldPassword) {
      const isMatch = await bcrypt.compare(oldPassword, user.passwordHash);
      if (!isMatch) return sendError(res, 'Current password is incorrect', 400);
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: newHash,
        mustChangePassword: false,
      },
    });

    await prisma.auditLog.create({
      data: {
        actorId: user.id,
        action: 'PASSWORD_CHANGED',
        entityType: 'User',
        entityId: user.id,
      },
    });

    return sendSuccess(res, 'Password changed successfully');
  } catch (error: any) {
    return sendError(res, 'Failed to change password', 500, error);
  }
};
