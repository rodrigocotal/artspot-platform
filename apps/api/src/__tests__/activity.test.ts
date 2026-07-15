import request from 'supertest';
import app from '../app';
import { createTestAdmin, createTestUser, authHeader } from './helpers/auth.helper';
import { cleanDatabase, disconnectTestDb } from './helpers/clean';

beforeEach(cleanDatabase);
afterAll(disconnectTestDb);

const activityPayload = {
  eventType: 'page_view',
  sessionId: 'sess_test_123456789',
  visitorId: 'vis_test_123456789',
  path: '/artworks',
  title: 'Browse Artworks',
  referrer: 'https://example.com',
  metadata: { width: 1440, height: 900 },
};

describe('Activity API', () => {
  it('should record an anonymous activity event', async () => {
    const res = await request(app).post('/activity').send(activityPayload);

    expect(res.status).toBe(201);
    expect(res.body.data.eventType).toBe('page_view');
    expect(res.body.data.path).toBe('/artworks');
  });

  it('should attach authenticated user activity to the user', async () => {
    const { accessToken } = await createTestUser();

    await request(app)
      .post('/activity')
      .set(authHeader(accessToken))
      .send({ ...activityPayload, path: '/account' });

    const { accessToken: adminToken } = await createTestAdmin();
    const listRes = await request(app).get('/activity').set(authHeader(adminToken));

    expect(listRes.status).toBe(200);
    expect(listRes.body.data[0].path).toBe('/account');
    expect(listRes.body.data[0].user).toBeTruthy();
  });

  it('should summarize recent activity for staff dashboards', async () => {
    const { accessToken } = await createTestAdmin();
    await request(app).post('/activity').send(activityPayload);
    await request(app).post('/activity').send({
      ...activityPayload,
      eventType: 'engagement',
      path: '/collections',
    });

    const res = await request(app).get('/activity/summary').set(authHeader(accessToken));

    expect(res.status).toBe(200);
    expect(res.body.data.totalEvents).toBe(2);
    expect(res.body.data.pageViews).toBe(1);
    expect(res.body.data.uniqueSessions).toBe(1);
    expect(res.body.data.topPages[0]).toEqual({ path: '/artworks', count: 1 });
  });

  it('should reject invalid activity events', async () => {
    const res = await request(app).post('/activity').send({
      ...activityPayload,
      eventType: 'unknown',
    });

    expect(res.status).toBe(400);
  });

  it('should restrict activity listing to staff users', async () => {
    const { accessToken } = await createTestUser();
    const res = await request(app).get('/activity').set(authHeader(accessToken));

    expect(res.status).toBe(403);
  });
});
