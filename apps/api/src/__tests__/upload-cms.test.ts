import request from 'supertest';
import path from 'path';
import { PassThrough } from 'stream';

// Mock cloudinary BEFORE app import so the upload middleware uses the mock
jest.mock('../config/cloudinary', () => {
  const mockPublicId = `cms/mock_${Date.now()}_tiny`;
  const mockResponse = {
    public_id: mockPublicId,
    secure_url: `https://res.cloudinary.com/test/image/upload/${mockPublicId}`,
    bytes: 68,
    width: 1,
    height: 1,
    format: 'png',
  };

  const uploadStreamMock = jest.fn((_opts: any, callback: any) => {
    const pt = new PassThrough();
    // Emit the response after the stream is consumed
    pt.on('finish', () => callback(null, mockResponse));
    return pt;
  });

  const mockCloudinary = {
    config: jest.fn(),
    uploader: {
      upload_stream: uploadStreamMock,
      destroy: jest.fn((_id: any, _opts: any, cb: any) => cb(null, { result: 'ok' })),
    },
    api: {
      resource: jest.fn().mockResolvedValue(mockResponse),
    },
    url: jest.fn().mockReturnValue('https://res.cloudinary.com/test/image/upload/transformed'),
  };

  return {
    __esModule: true,
    default: mockCloudinary,
    initializeCloudinary: jest.fn(),
    getImageUrl: jest.fn().mockReturnValue('https://res.cloudinary.com/test/image/upload/transformed'),
    getImageInfo: jest.fn().mockResolvedValue(mockResponse),
    deleteImage: jest.fn().mockResolvedValue(true),
    uploadArtworkImage: jest.fn().mockResolvedValue(mockResponse),
    UPLOAD_PRESETS: {
      ARTWORK: 'artspot_artwork',
      ARTIST: 'artspot_artist',
      COLLECTION: 'artspot_collection',
    },
    ARTWORK_TRANSFORMATIONS: {},
  };
});

import app from '../app';
import cloudinary from '../config/cloudinary';
import { createTestUser, createTestAdmin, authHeader } from './helpers/auth.helper';
import { cleanDatabase, disconnectTestDb } from './helpers/clean';

beforeEach(cleanDatabase);
afterAll(disconnectTestDb);

const FIXTURE = path.join(__dirname, 'fixtures', 'tiny.png');

describe('POST /upload/cms', () => {
  it('rejects unauthenticated', async () => {
    const res = await request(app).post('/upload/cms').attach('image', FIXTURE);
    expect(res.status).toBe(401);
  });

  it('rejects non-admin role', async () => {
    const { accessToken } = await createTestUser();
    const res = await request(app)
      .post('/upload/cms')
      .set(authHeader(accessToken))
      .attach('image', FIXTURE);
    expect(res.status).toBe(403);
  });

  it('uploads and returns image data for admin', async () => {
    const { accessToken } = await createTestAdmin();
    const res = await request(app)
      .post('/upload/cms')
      .set(authHeader(accessToken))
      .attach('image', FIXTURE);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.image).toBeDefined();
    expect(res.body.image.url).toBeDefined();
    expect(res.body.image.publicId).toBeDefined();
    expect(res.body.image.publicId).toMatch(/^cms\//);
    // Verify the storage actually requested folder: 'cms' from Cloudinary
    expect((cloudinary as any).uploader.upload_stream).toHaveBeenCalledWith(
      expect.objectContaining({ folder: 'cms' }),
      expect.any(Function),
    );
  });

  it('rejects when no file provided', async () => {
    const { accessToken } = await createTestAdmin();
    const res = await request(app).post('/upload/cms').set(authHeader(accessToken));
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
