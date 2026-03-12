import bcrypt from 'bcryptjs';
import jwt, { type SignOptions } from 'jsonwebtoken';
import crypto from 'crypto';
import { prisma } from '../config/database';
import { config } from '../config/environment';
import type { RegisterInput, LoginInput } from '../validators/auth.validator';

const SALT_ROUNDS = 12;
const REFRESH_TOKEN_DAYS = 7;

const safeUserSelect = {
  id: true,
  email: true,
  name: true,
  role: true,
  createdAt: true,
  updatedAt: true,
};

export class AuthService {
  async register(data: RegisterInput) {
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) throw new Error('Email already registered');

    const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        passwordHash,
      },
      select: safeUserSelect,
    });

    const tokens = await this.generateTokens(user.id);
    return { user, ...tokens };
  }

  async login(data: LoginInput) {
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user || !user.passwordHash) throw new Error('Invalid credentials');

    const valid = await bcrypt.compare(data.password, user.passwordHash);
    if (!valid) throw new Error('Invalid credentials');

    const tokens = await this.generateTokens(user.id);

    const { passwordHash: _, ...safeUser } = user;
    return { user: safeUser, ...tokens };
  }

  async refreshTokens(refreshToken: string) {
    const stored = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
      // Possible token reuse — revoke all tokens for this user
      if (stored?.revokedAt) {
        await prisma.refreshToken.updateMany({
          where: { userId: stored.userId },
          data: { revokedAt: new Date() },
        });
      }
      throw new Error('Invalid refresh token');
    }

    // Rotate: revoke old token, issue new pair
    await prisma.refreshToken.update({
      where: { id: stored.id },
      data: { revokedAt: new Date() },
    });

    const { passwordHash: _, ...safeUser } = stored.user;
    const tokens = await this.generateTokens(stored.userId);
    return { user: safeUser, ...tokens };
  }

  async logout(refreshToken: string) {
    await prisma.refreshToken.updateMany({
      where: { token: refreshToken },
      data: { revokedAt: new Date() },
    });
  }

  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: safeUserSelect,
    });
    if (!user) throw new Error('User not found');
    return user;
  }

  verifyAccessToken(token: string): { sub: string } {
    return jwt.verify(token, config.jwtSecret) as { sub: string };
  }

  private async generateTokens(userId: string) {
    const accessToken = jwt.sign({ sub: userId }, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn,
    } as SignOptions);

    const refreshTokenValue = crypto.randomBytes(40).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_DAYS);

    await prisma.refreshToken.create({
      data: { token: refreshTokenValue, userId, expiresAt },
    });

    return { accessToken, refreshToken: refreshTokenValue };
  }
}

export const authService = new AuthService();
