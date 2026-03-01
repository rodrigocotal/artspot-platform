import request from 'supertest';
import app from '../app';
import { createTestUser, authHeader } from './helpers/auth.helper';
import { createTestArtist, createTestArtwork } from './helpers/seed.helper';
import { cleanDatabase, disconnectTestDb } from './helpers/clean';

beforeEach(cleanDatabase);
afterAll(disconnectTestDb);

describe('Favorites API', () => {
  describe('POST /favorites', () => {
    it('should add artwork to favorites', async () => {
      const { accessToken } = await createTestUser();
      const artist = await createTestArtist();
      const artwork = await createTestArtwork(artist.id);

      const res = await request(app)
        .post('/favorites')
        .set(authHeader(accessToken))
        .send({ artworkId: artwork.id });

      expect(res.status).toBe(201);
      expect(res.body.data.favorited).toBe(true);
    });

    it('should toggle (remove) existing favorite', async () => {
      const { accessToken } = await createTestUser();
      const artist = await createTestArtist();
      const artwork = await createTestArtwork(artist.id);

      // Add favorite
      await request(app)
        .post('/favorites')
        .set(authHeader(accessToken))
        .send({ artworkId: artwork.id });

      // Toggle off
      const res = await request(app)
        .post('/favorites')
        .set(authHeader(accessToken))
        .send({ artworkId: artwork.id });

      expect(res.status).toBe(200);
      expect(res.body.data.favorited).toBe(false);
    });

    it('should reject unauthenticated request', async () => {
      const artist = await createTestArtist();
      const artwork = await createTestArtwork(artist.id);

      const res = await request(app)
        .post('/favorites')
        .send({ artworkId: artwork.id });

      expect(res.status).toBe(401);
    });

    it('should return 404 for non-existent artwork', async () => {
      const { accessToken } = await createTestUser();

      const res = await request(app)
        .post('/favorites')
        .set(authHeader(accessToken))
        .send({ artworkId: 'clxxxxxxxxxxxxxxxxxxxxxxxxx' });

      expect(res.status).toBe(404);
    });
  });

  describe('GET /favorites', () => {
    it('should list user favorites', async () => {
      const { accessToken } = await createTestUser();
      const artist = await createTestArtist();
      const artwork1 = await createTestArtwork(artist.id, { title: 'Fav 1' });
      const artwork2 = await createTestArtwork(artist.id, { title: 'Fav 2' });

      // Add both as favorites
      await request(app)
        .post('/favorites')
        .set(authHeader(accessToken))
        .send({ artworkId: artwork1.id });
      await request(app)
        .post('/favorites')
        .set(authHeader(accessToken))
        .send({ artworkId: artwork2.id });

      const res = await request(app)
        .get('/favorites')
        .set(authHeader(accessToken));

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(2);
    });

    it('should return empty list when no favorites', async () => {
      const { accessToken } = await createTestUser();

      const res = await request(app)
        .get('/favorites')
        .set(authHeader(accessToken));

      expect(res.status).toBe(200);
      expect(res.body.data).toEqual([]);
    });

    it('should reject unauthenticated request', async () => {
      const res = await request(app).get('/favorites');
      expect(res.status).toBe(401);
    });
  });

  describe('DELETE /favorites/:id', () => {
    it('should remove a favorite by ID', async () => {
      const { accessToken } = await createTestUser();
      const artist = await createTestArtist();
      const artwork = await createTestArtwork(artist.id);

      // Add favorite
      await request(app)
        .post('/favorites')
        .set(authHeader(accessToken))
        .send({ artworkId: artwork.id });

      // List to get the favorite ID
      const listRes = await request(app)
        .get('/favorites')
        .set(authHeader(accessToken));

      const favoriteId = listRes.body.data[0].id;

      // Delete
      const res = await request(app)
        .delete(`/favorites/${favoriteId}`)
        .set(authHeader(accessToken));

      expect(res.status).toBe(204);

      // Verify it's gone
      const verifyRes = await request(app)
        .get('/favorites')
        .set(authHeader(accessToken));

      expect(verifyRes.body.data.length).toBe(0);
    });

    it('should reject unauthenticated delete', async () => {
      const res = await request(app).delete('/favorites/some-id');
      expect(res.status).toBe(401);
    });
  });
});
