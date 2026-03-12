import request from 'supertest';
import app from '../app';
import { createTestUser, authHeader } from './helpers/auth.helper';
import { cleanDatabase, disconnectTestDb } from './helpers/clean';

beforeEach(cleanDatabase);
afterAll(disconnectTestDb);

describe('Auth API', () => {
  describe('POST /auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({
          email: 'newuser@test.com',
          password: 'TestPass123',
          name: 'New User',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe('newuser@test.com');
      expect(res.body.data.user.name).toBe('New User');
      expect(res.body.data.user.role).toBe('COLLECTOR');
      expect(res.body.data.accessToken).toBeDefined();
      expect(res.body.data.refreshToken).toBeDefined();
      // Password hash must not be exposed
      expect(res.body.data.user.passwordHash).toBeUndefined();
    });

    it('should reject duplicate email', async () => {
      await createTestUser({ email: 'dup@test.com' });

      const res = await request(app)
        .post('/auth/register')
        .send({
          email: 'dup@test.com',
          password: 'TestPass123',
          name: 'Dup User',
        });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
    });

    it('should reject weak password', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({
          email: 'weak@test.com',
          password: 'weak',
          name: 'Weak User',
        });

      expect(res.status).toBe(400);
    });

    it('should reject invalid email', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({
          email: 'not-an-email',
          password: 'TestPass123',
          name: 'Bad Email',
        });

      expect(res.status).toBe(400);
    });
  });

  describe('POST /auth/login', () => {
    it('should login with valid credentials', async () => {
      const { email, password } = await createTestUser();

      const res = await request(app)
        .post('/auth/login')
        .send({ email, password });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.accessToken).toBeDefined();
      expect(res.body.data.refreshToken).toBeDefined();
      expect(res.body.data.user.email).toBe(email);
    });

    it('should reject invalid credentials', async () => {
      await createTestUser({ email: 'login@test.com' });

      const res = await request(app)
        .post('/auth/login')
        .send({ email: 'login@test.com', password: 'WrongPass123' });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should reject non-existent email', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({ email: 'noone@test.com', password: 'TestPass123' });

      expect(res.status).toBe(401);
    });
  });

  describe('POST /auth/refresh', () => {
    it('should refresh tokens with valid refresh token', async () => {
      const { refreshToken } = await createTestUser();

      const res = await request(app)
        .post('/auth/refresh')
        .send({ refreshToken });

      expect(res.status).toBe(200);
      expect(res.body.data.accessToken).toBeDefined();
      expect(res.body.data.refreshToken).toBeDefined();
      // New refresh token should be different (rotation)
      expect(res.body.data.refreshToken).not.toBe(refreshToken);
    });

    it('should reject revoked refresh token', async () => {
      const { refreshToken } = await createTestUser();

      // Use the token once (it gets revoked after rotation)
      await request(app)
        .post('/auth/refresh')
        .send({ refreshToken });

      // Try to use the old token again
      const res = await request(app)
        .post('/auth/refresh')
        .send({ refreshToken });

      expect(res.status).toBe(401);
    });

    it('should reject invalid refresh token', async () => {
      const res = await request(app)
        .post('/auth/refresh')
        .send({ refreshToken: 'totally-fake-token' });

      expect(res.status).toBe(401);
    });
  });

  describe('POST /auth/logout', () => {
    it('should logout successfully', async () => {
      const { refreshToken } = await createTestUser();

      const res = await request(app)
        .post('/auth/logout')
        .send({ refreshToken });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      // Refresh token should no longer work
      const refreshRes = await request(app)
        .post('/auth/refresh')
        .send({ refreshToken });

      expect(refreshRes.status).toBe(401);
    });
  });

  describe('GET /auth/profile', () => {
    it('should return user profile with valid token', async () => {
      const { accessToken, email } = await createTestUser();

      const res = await request(app)
        .get('/auth/profile')
        .set(authHeader(accessToken));

      expect(res.status).toBe(200);
      expect(res.body.data.email).toBe(email);
      expect(res.body.data.passwordHash).toBeUndefined();
    });

    it('should reject unauthenticated request', async () => {
      const res = await request(app).get('/auth/profile');

      expect(res.status).toBe(401);
    });

    it('should reject invalid token', async () => {
      const res = await request(app)
        .get('/auth/profile')
        .set(authHeader('invalid-token'));

      expect(res.status).toBe(401);
    });
  });
});
