import request from 'supertest';
import app from '../app';
import { createTestUser, createTestAdmin, createTestStaff, authHeader } from './helpers/auth.helper';
import { createTestArtist, createTestArtwork } from './helpers/seed.helper';
import { cleanDatabase, disconnectTestDb } from './helpers/clean';

beforeEach(cleanDatabase);
afterAll(disconnectTestDb);

describe('Inquiries API', () => {
  describe('POST /inquiries', () => {
    it('should create inquiry as guest (with optionalAuth)', async () => {
      const artist = await createTestArtist();
      const artwork = await createTestArtwork(artist.id);

      const res = await request(app)
        .post('/inquiries')
        .send({
          artworkId: artwork.id,
          name: 'Guest User',
          email: 'guest@test.com',
          message: 'I am interested in this artwork, could you tell me more?',
        });

      expect(res.status).toBe(201);
      expect(res.body.data.name).toBe('Guest User');
      expect(res.body.data.status).toBe('PENDING');
      expect(res.body.data.userId).toBeNull();
    });

    it('should create inquiry as authenticated user', async () => {
      const { accessToken } = await createTestUser();
      const artist = await createTestArtist();
      const artwork = await createTestArtwork(artist.id);

      const res = await request(app)
        .post('/inquiries')
        .set(authHeader(accessToken))
        .send({
          artworkId: artwork.id,
          name: 'Auth User',
          email: 'authuser@test.com',
          message: 'I would like to purchase this artwork, please provide details.',
        });

      expect(res.status).toBe(201);
      expect(res.body.data.userId).toBeDefined();
    });

    it('should reject inquiry with missing required fields', async () => {
      const artist = await createTestArtist();
      const artwork = await createTestArtwork(artist.id);

      const res = await request(app)
        .post('/inquiries')
        .send({
          artworkId: artwork.id,
          // Missing name, email, message
        });

      expect(res.status).toBe(400);
    });

    it('should reject inquiry for non-existent artwork', async () => {
      const res = await request(app)
        .post('/inquiries')
        .send({
          artworkId: 'clxxxxxxxxxxxxxxxxxxxxxxxxx',
          name: 'Test',
          email: 'test@test.com',
          message: 'Inquiry about an artwork that does not exist in the system.',
        });

      expect(res.status).toBe(404);
    });
  });

  describe('GET /inquiries', () => {
    it('should list user own inquiries', async () => {
      const { accessToken } = await createTestUser();
      const artist = await createTestArtist();
      const artwork = await createTestArtwork(artist.id);

      // Create inquiry
      await request(app)
        .post('/inquiries')
        .set(authHeader(accessToken))
        .send({
          artworkId: artwork.id,
          name: 'Inquiry User',
          email: 'inq@test.com',
          message: 'I want to know more about this wonderful artwork please.',
        });

      const res = await request(app)
        .get('/inquiries')
        .set(authHeader(accessToken));

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
    });

    it('should reject unauthenticated list', async () => {
      const res = await request(app).get('/inquiries');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /inquiries/admin', () => {
    it('should list all inquiries as admin', async () => {
      const artist = await createTestArtist();
      const artwork = await createTestArtwork(artist.id);
      const { accessToken: adminToken } = await createTestAdmin();

      // Create a guest inquiry
      await request(app)
        .post('/inquiries')
        .send({
          artworkId: artwork.id,
          name: 'Guest',
          email: 'guest@test.com',
          message: 'Guest inquiry about the artwork for the admin to see.',
        });

      const res = await request(app)
        .get('/inquiries/admin')
        .set(authHeader(adminToken));

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    });

    it('should reject admin list for regular user', async () => {
      const { accessToken } = await createTestUser();

      const res = await request(app)
        .get('/inquiries/admin')
        .set(authHeader(accessToken));

      expect(res.status).toBe(403);
    });
  });

  describe('PATCH /inquiries/:id', () => {
    it('should allow staff to respond to inquiry', async () => {
      const artist = await createTestArtist();
      const artwork = await createTestArtwork(artist.id);
      const { accessToken: staffToken } = await createTestStaff();

      // Create inquiry
      const createRes = await request(app)
        .post('/inquiries')
        .send({
          artworkId: artwork.id,
          name: 'Inquirer',
          email: 'inquirer@test.com',
          message: 'I would like to know more about this artwork please.',
        });

      const inquiryId = createRes.body.data.id;

      const res = await request(app)
        .patch(`/inquiries/${inquiryId}`)
        .set(authHeader(staffToken))
        .send({
          response: 'Thank you for your interest. This artwork is available for viewing.',
          status: 'RESPONDED',
        });

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('RESPONDED');
      expect(res.body.data.response).toBeDefined();
      expect(res.body.data.respondedAt).toBeDefined();
    });

    it('should reject respond from regular user', async () => {
      const artist = await createTestArtist();
      const artwork = await createTestArtwork(artist.id);
      const { accessToken: userToken } = await createTestUser();

      const createRes = await request(app)
        .post('/inquiries')
        .send({
          artworkId: artwork.id,
          name: 'Inquirer',
          email: 'inquirer@test.com',
          message: 'Interested in this artwork, please share more details.',
        });

      const inquiryId = createRes.body.data.id;

      const res = await request(app)
        .patch(`/inquiries/${inquiryId}`)
        .set(authHeader(userToken))
        .send({
          response: 'Should not work',
          status: 'RESPONDED',
        });

      expect(res.status).toBe(403);
    });
  });
});
