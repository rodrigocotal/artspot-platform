import request from 'supertest';
import app from '../app';
import { createTestUser, createTestAdmin, createTestStaff, authHeader } from './helpers/auth.helper';
import { cleanDatabase, disconnectTestDb } from './helpers/clean';

beforeEach(cleanDatabase);
afterAll(disconnectTestDb);

/** Helper: save a draft for a slug as an admin. */
async function saveDraft(slug: string, content: Record<string, any>, token: string) {
  return request(app).put(`/pages/${slug}`).set(authHeader(token)).send({ content });
}

describe('Page Content (CMS) API', () => {
  describe('PUT /pages/:slug', () => {
    it('should save a draft as admin and set status DRAFT', async () => {
      const { accessToken } = await createTestAdmin();

      const res = await saveDraft('home', { headline: 'Hello' }, accessToken);

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('DRAFT');
      expect(res.body.data.draftContent.headline).toBe('Hello');
    });

    it('should allow gallery staff to save a draft', async () => {
      const { accessToken } = await createTestStaff();
      const res = await saveDraft('contact', { headline: 'Contact' }, accessToken);
      expect(res.status).toBe(200);
    });

    it('should reject a draft save from a regular user', async () => {
      const { accessToken } = await createTestUser();
      const res = await saveDraft('home', { headline: 'x' }, accessToken);
      expect(res.status).toBe(403);
    });

    it('should reject an unknown slug', async () => {
      const { accessToken } = await createTestAdmin();
      const res = await saveDraft('not-a-real-slug', { headline: 'x' }, accessToken);
      expect(res.status).toBe(400);
    });

    it('should reject content exceeding the maximum size', async () => {
      const { accessToken } = await createTestAdmin();
      const huge = 'a'.repeat(100_001);
      const res = await saveDraft('home', { blob: huge }, accessToken);
      expect(res.status).toBe(400);
    });
  });

  describe('GET /pages/:slug (public)', () => {
    it('should return published content and never expose draftContent', async () => {
      const { accessToken } = await createTestAdmin();
      await saveDraft('home', { headline: 'Draft headline' }, accessToken);
      await request(app).post('/pages/home/publish').set(authHeader(accessToken));

      // Save a new draft on top of the published content
      await saveDraft('home', { headline: 'Newer draft' }, accessToken);

      const res = await request(app).get('/pages/home');

      expect(res.status).toBe(200);
      expect(res.body.data.content.headline).toBe('Draft headline');
      expect(res.body.data.draftContent).toBeUndefined();
    });

    it('should return 404 for a page that does not exist', async () => {
      const res = await request(app).get('/pages/home');
      expect(res.status).toBe(404);
    });

    it('should not expose draft content via the public route even when authenticated', async () => {
      const { accessToken } = await createTestAdmin();
      await saveDraft('home', { headline: 'secret draft' }, accessToken);

      // Public route, authenticated request — must still not leak draftContent
      const res = await request(app).get('/pages/home').set(authHeader(accessToken));

      // Newly-created record has content {} (never published) and no draftContent exposed
      expect(res.body.data.draftContent).toBeUndefined();
      expect(res.body.data.content.headline).toBeUndefined();
    });
  });

  describe('GET /pages/:slug/draft (admin/staff only)', () => {
    it('should return draftContent for an admin', async () => {
      const { accessToken } = await createTestAdmin();
      await saveDraft('home', { headline: 'work in progress' }, accessToken);

      const res = await request(app).get('/pages/home/draft').set(authHeader(accessToken));

      expect(res.status).toBe(200);
      expect(res.body.data.draftContent.headline).toBe('work in progress');
    });

    it('should reject an unauthenticated request', async () => {
      const res = await request(app).get('/pages/home/draft');
      expect(res.status).toBe(401);
    });

    it('should reject a regular (non-staff) user — drafts must not leak', async () => {
      const { accessToken: adminToken } = await createTestAdmin();
      await saveDraft('home', { headline: 'unpublished' }, adminToken);

      const { accessToken: userToken } = await createTestUser();
      const res = await request(app).get('/pages/home/draft').set(authHeader(userToken));

      expect(res.status).toBe(403);
    });
  });

  describe('POST /pages/:slug/publish', () => {
    it('should copy draft to content, clear the draft, and set PUBLISHED', async () => {
      const { accessToken } = await createTestAdmin();
      await saveDraft('home', { headline: 'Ready' }, accessToken);

      const res = await request(app).post('/pages/home/publish').set(authHeader(accessToken));

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('PUBLISHED');
      expect(res.body.data.content.headline).toBe('Ready');
      expect(res.body.data.draftContent).toBeNull();
    });

    it('should reject publish from a regular user', async () => {
      const { accessToken } = await createTestUser();
      const res = await request(app).post('/pages/home/publish').set(authHeader(accessToken));
      expect(res.status).toBe(403);
    });

    it('should reject an unknown slug', async () => {
      const { accessToken } = await createTestAdmin();
      const res = await request(app).post('/pages/not-real/publish').set(authHeader(accessToken));
      expect(res.status).toBe(400);
    });

    it('should 404 when publishing a slug with no record yet', async () => {
      const { accessToken } = await createTestAdmin();
      const res = await request(app).post('/pages/home/publish').set(authHeader(accessToken));
      expect(res.status).toBe(404);
    });
  });
});
