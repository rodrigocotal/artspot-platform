import request from 'supertest';
import app from '../../app';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

let userCounter = 0;

function uniqueEmail(prefix: string) {
  userCounter++;
  return `${prefix}-${userCounter}-${Date.now()}@test.com`;
}

export async function createTestUser(overrides: { email?: string; name?: string; password?: string } = {}) {
  const email = overrides.email || uniqueEmail('user');
  const password = overrides.password || 'TestPass123';
  const name = overrides.name || 'Test User';

  const res = await request(app)
    .post('/auth/register')
    .send({ email, password, name });

  return {
    user: res.body.data.user,
    accessToken: res.body.data.accessToken,
    refreshToken: res.body.data.refreshToken,
    email,
    password,
  };
}

export async function createTestAdmin(overrides: { email?: string } = {}) {
  const email = overrides.email || uniqueEmail('admin');
  const password = 'AdminPass123';
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      email,
      name: 'Test Admin',
      passwordHash,
      role: 'ADMIN',
    },
  });

  const res = await request(app)
    .post('/auth/login')
    .send({ email, password });

  return {
    user: res.body.data.user,
    accessToken: res.body.data.accessToken,
    refreshToken: res.body.data.refreshToken,
    email,
    password,
  };
}

export async function createTestStaff(overrides: { email?: string } = {}) {
  const email = overrides.email || uniqueEmail('staff');
  const password = 'StaffPass123';
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      email,
      name: 'Test Staff',
      passwordHash,
      role: 'GALLERY_STAFF',
    },
  });

  const res = await request(app)
    .post('/auth/login')
    .send({ email, password });

  return {
    user: res.body.data.user,
    accessToken: res.body.data.accessToken,
    refreshToken: res.body.data.refreshToken,
    email,
    password,
  };
}

export function authHeader(token: string) {
  return { Authorization: `Bearer ${token}` };
}
