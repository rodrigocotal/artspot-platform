import request from 'supertest';
import app from '../app';
import { createTestUser, createTestAdmin, createTestStaff, authHeader } from './helpers/auth.helper';
import { cleanDatabase, disconnectTestDb } from './helpers/clean';

beforeEach(cleanDatabase);
afterAll(disconnectTestDb);

describe('Contact API', () => {
  describe('POST /contact', () => {
    it('should create a contact message as a guest', async () => {
      const res = await request(app)
        .post('/contact')
        .send({
          name: 'Jane Visitor',
          email: 'jane@example.com',
          subject: 'Question about a painting',
          message: 'Hello, I would like to know if you ship internationally.',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Jane Visitor');
      expect(res.body.data.email).toBe('jane@example.com');
      expect(res.body.data.status).toBe('NEW');
    });

    it('should create a contact message without an optional subject', async () => {
      const res = await request(app)
        .post('/contact')
        .send({
          name: 'No Subject',
          email: 'nosubject@example.com',
          message: 'Just reaching out with a general question for the gallery.',
        });

      expect(res.status).toBe(201);
      expect(res.body.data.subject).toBeNull();
    });

    it('should reject a contact message with missing required fields', async () => {
      const res = await request(app)
        .post('/contact')
        .send({ name: 'Incomplete' });

      expect(res.status).toBe(400);
    });

    it('should reject a contact message with an invalid email', async () => {
      const res = await request(app)
        .post('/contact')
        .send({
          name: 'Bad Email',
          email: 'not-an-email',
          message: 'This message has an invalid email address attached to it.',
        });

      expect(res.status).toBe(400);
    });
  });

  describe('GET /contact/admin', () => {
    it('should list all contact messages as admin', async () => {
      const { accessToken: adminToken } = await createTestAdmin();

      await request(app)
        .post('/contact')
        .send({
          name: 'Guest',
          email: 'guest@example.com',
          message: 'A contact message for the admin list to return back.',
        });

      const res = await request(app)
        .get('/contact/admin')
        .set(authHeader(adminToken));

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
      expect(res.body.pagination.total).toBeGreaterThanOrEqual(1);
    });

    it('should reject the admin list for a regular user', async () => {
      const { accessToken } = await createTestUser();

      const res = await request(app)
        .get('/contact/admin')
        .set(authHeader(accessToken));

      expect(res.status).toBe(403);
    });

    it('should reject the admin list when unauthenticated', async () => {
      const res = await request(app).get('/contact/admin');
      expect(res.status).toBe(401);
    });
  });

  describe('PATCH /contact/:id', () => {
    it('should allow staff to mark a message as read', async () => {
      const { accessToken: staffToken } = await createTestStaff();

      const createRes = await request(app)
        .post('/contact')
        .send({
          name: 'Reader',
          email: 'reader@example.com',
          message: 'Please mark this message as read once you have seen it.',
        });

      const id = createRes.body.data.id;

      const res = await request(app)
        .patch(`/contact/${id}`)
        .set(authHeader(staffToken))
        .send({ status: 'READ' });

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('READ');
    });

    it('should return 404 for a non-existent message', async () => {
      const { accessToken: staffToken } = await createTestStaff();

      const res = await request(app)
        .patch('/contact/clxxxxxxxxxxxxxxxxxxxxxxxxx')
        .set(authHeader(staffToken))
        .send({ status: 'READ' });

      expect(res.status).toBe(404);
    });

    it('should reject status updates from a regular user', async () => {
      const { accessToken } = await createTestUser();

      const res = await request(app)
        .patch('/contact/clxxxxxxxxxxxxxxxxxxxxxxxxx')
        .set(authHeader(accessToken))
        .send({ status: 'READ' });

      expect(res.status).toBe(403);
    });
  });
});
