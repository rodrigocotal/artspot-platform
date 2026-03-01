import request from 'supertest';
import app from '../app';
import { createTestUser, createTestAdmin, authHeader } from './helpers/auth.helper';
import { createTestArtist, createTestArtwork } from './helpers/seed.helper';
import { cleanDatabase, disconnectTestDb } from './helpers/clean';

beforeEach(cleanDatabase);
afterAll(disconnectTestDb);

describe('Artworks API', () => {
  describe('GET /artworks', () => {
    it('should return an empty list when no artworks exist', async () => {
      const res = await request(app).get('/artworks');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual([]);
    });

    it('should list available artworks', async () => {
      const artist = await createTestArtist();
      await createTestArtwork(artist.id);
      await createTestArtwork(artist.id, { title: 'Second Work' });

      const res = await request(app).get('/artworks');

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(2);
    });

    it('should filter by medium', async () => {
      const artist = await createTestArtist();
      await createTestArtwork(artist.id, { medium: 'PAINTING' });
      await createTestArtwork(artist.id, { medium: 'SCULPTURE' });

      const res = await request(app).get('/artworks?medium=PAINTING');

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].medium).toBe('PAINTING');
    });

    it('should filter by style', async () => {
      const artist = await createTestArtist();
      await createTestArtwork(artist.id, { style: 'ABSTRACT' });
      await createTestArtwork(artist.id, { style: 'REALISM' });

      const res = await request(app).get('/artworks?style=ABSTRACT');

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].style).toBe('ABSTRACT');
    });

    it('should sort by price ascending', async () => {
      const artist = await createTestArtist();
      await createTestArtwork(artist.id, { price: 5000, title: 'Expensive' });
      await createTestArtwork(artist.id, { price: 500, title: 'Cheap' });

      const res = await request(app).get('/artworks?sortBy=price&sortOrder=asc');

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(2);
      expect(parseFloat(res.body.data[0].price)).toBeLessThanOrEqual(parseFloat(res.body.data[1].price));
    });

    it('should paginate results', async () => {
      const artist = await createTestArtist();
      for (let i = 0; i < 5; i++) {
        await createTestArtwork(artist.id, { title: `Work ${i}` });
      }

      const res = await request(app).get('/artworks?page=1&limit=2');

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(2);
      expect(res.body.pagination.total).toBe(5);
      expect(res.body.pagination.totalPages).toBe(3);
    });

    it('should annotate isFavorited for authenticated users', async () => {
      const artist = await createTestArtist();
      const artwork = await createTestArtwork(artist.id);
      const { accessToken } = await createTestUser();

      // Favorite the artwork
      await request(app)
        .post('/favorites')
        .set(authHeader(accessToken))
        .send({ artworkId: artwork.id });

      const res = await request(app)
        .get('/artworks')
        .set(authHeader(accessToken));

      expect(res.status).toBe(200);
      expect(res.body.data[0].isFavorited).toBe(true);
    });
  });

  describe('GET /artworks/:id', () => {
    it('should get artwork by ID', async () => {
      const artist = await createTestArtist();
      const artwork = await createTestArtwork(artist.id, { title: 'By ID' });

      const res = await request(app).get(`/artworks/${artwork.id}`);

      expect(res.status).toBe(200);
      expect(res.body.data.title).toBe('By ID');
      expect(res.body.data.artist).toBeDefined();
      expect(res.body.data.images).toBeDefined();
    });

    it('should get artwork by slug', async () => {
      const artist = await createTestArtist();
      const artwork = await createTestArtwork(artist.id, { title: 'By Slug' });

      const res = await request(app).get(`/artworks/${artwork.slug}`);

      expect(res.status).toBe(200);
      expect(res.body.data.title).toBe('By Slug');
    });

    it('should return 404 for non-existent artwork', async () => {
      const res = await request(app).get('/artworks/non-existent-slug');

      expect(res.status).toBe(404);
    });
  });

  describe('GET /artworks/:id/related', () => {
    it('should return related artworks by same artist', async () => {
      const artist = await createTestArtist();
      const artwork = await createTestArtwork(artist.id, { title: 'Main' });
      await createTestArtwork(artist.id, { title: 'Related 1' });
      await createTestArtwork(artist.id, { title: 'Related 2' });

      const res = await request(app).get(`/artworks/${artwork.id}/related`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(2);
      // Should not include the original artwork
      expect(res.body.data.every((a: any) => a.id !== artwork.id)).toBe(true);
    });
  });

  describe('POST /artworks', () => {
    it('should create artwork as admin', async () => {
      const { accessToken } = await createTestAdmin();
      const artist = await createTestArtist();

      const res = await request(app)
        .post('/artworks')
        .set(authHeader(accessToken))
        .send({
          title: 'New Artwork',
          slug: 'new-artwork',
          artistId: artist.id,
          medium: 'PAINTING',
          price: 2500,
        });

      expect(res.status).toBe(201);
      expect(res.body.data.title).toBe('New Artwork');
    });

    it('should reject creation by regular user', async () => {
      const { accessToken } = await createTestUser();
      const artist = await createTestArtist();

      const res = await request(app)
        .post('/artworks')
        .set(authHeader(accessToken))
        .send({
          title: 'Unauthorized',
          slug: 'unauthorized',
          artistId: artist.id,
          medium: 'PAINTING',
          price: 1000,
        });

      expect(res.status).toBe(403);
    });

    it('should reject unauthenticated creation', async () => {
      const res = await request(app)
        .post('/artworks')
        .send({
          title: 'No Auth',
          slug: 'no-auth',
          artistId: 'fake',
          medium: 'PAINTING',
          price: 1000,
        });

      expect(res.status).toBe(401);
    });
  });

  describe('PUT /artworks/:id', () => {
    it('should update artwork as admin', async () => {
      const { accessToken } = await createTestAdmin();
      const artist = await createTestArtist();
      const artwork = await createTestArtwork(artist.id);

      const res = await request(app)
        .put(`/artworks/${artwork.id}`)
        .set(authHeader(accessToken))
        .send({ title: 'Updated Title' });

      expect(res.status).toBe(200);
      expect(res.body.data.title).toBe('Updated Title');
    });

    it('should return 404 for non-existent artwork', async () => {
      const { accessToken } = await createTestAdmin();

      const res = await request(app)
        .put('/artworks/clxxxxxxxxxxxxxxxxxxxxxxxxx')
        .set(authHeader(accessToken))
        .send({ title: 'Ghost' });

      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /artworks/:id', () => {
    it('should delete artwork as admin', async () => {
      const { accessToken } = await createTestAdmin();
      const artist = await createTestArtist();
      const artwork = await createTestArtwork(artist.id);

      const res = await request(app)
        .delete(`/artworks/${artwork.id}`)
        .set(authHeader(accessToken));

      expect(res.status).toBe(204);

      // Verify it's gone
      const getRes = await request(app).get(`/artworks/${artwork.id}`);
      expect(getRes.status).toBe(404);
    });
  });
});
