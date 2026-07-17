import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '4000', 10),
  apiUrl: process.env.API_URL || 'http://localhost:4000',

  // CORS — comma-separated list, or '*' to allow all origins
  allowedOrigins: process.env.ALLOWED_ORIGINS === '*'
    ? '*'
    : process.env.ALLOWED_ORIGINS?.split(',') || [
        'http://localhost:3000',
        'http://localhost:3001',
        'https://main.db0y1lrxbre06.amplifyapp.com',
        'https://develop.db0y1lrxbre06.amplifyapp.com',
        'https://www.artaldo.com',
        'https://artaldo.com',
      ],

  // Database
  databaseUrl: process.env.DATABASE_URL || '',

  // JWT
  jwtSecret: process.env.JWT_SECRET || 'change-me-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '15m',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'change-me-refresh-secret',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',

  // Cloudinary
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
  },

  // Email (AWS SES)
  email: {
    fromEmail: process.env.FROM_EMAIL || 'contact@artaldo.com',
    staffEmail: process.env.STAFF_EMAIL || 'art@artaldo.com; rodrigo@artaldo.com',
    awsRegion: process.env.AWS_SES_REGION || process.env.AWS_REGION || 'ap-southeast-2',
  },

  // Constant Contact
  constantContact: {
    enabled: process.env.CONSTANT_CONTACT_ENABLED === 'true',
    clientId: process.env.CONSTANT_CONTACT_CLIENT_ID || '',
    clientSecret: process.env.CONSTANT_CONTACT_CLIENT_SECRET || '',
    redirectUri:
      process.env.CONSTANT_CONTACT_REDIRECT_URI ||
      process.env.CONSTANT_CONTACT_REDIRECT_URI_Dev ||
      '',
    refreshToken: process.env.CONSTANT_CONTACT_REFRESH_TOKEN || '',
    newsletterListId: process.env.CONSTANT_CONTACT_NEWSLETTER_LIST_ID || '',
  },

  // Stripe
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
    successUrl: process.env.STRIPE_SUCCESS_URL || 'http://localhost:3000/checkout/success',
    cancelUrl: process.env.STRIPE_CANCEL_URL || 'http://localhost:3000/checkout/cancel',
  },
} as const;

// Validate required env + reject placeholder secrets in any DEPLOYED environment
// (anything that isn't local dev or tests). This protects staging and guards
// against a deploy where NODE_ENV is unset/misconfigured — otherwise the JWT
// secret would silently fall back to the forgeable 'change-me-in-production'.
if (config.nodeEnv !== 'development' && config.nodeEnv !== 'test') {
  const required = ['DATABASE_URL', 'JWT_SECRET', 'JWT_REFRESH_SECRET', 'STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET'];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }

  if (
    config.jwtSecret === 'change-me-in-production' ||
    config.jwtRefreshSecret === 'change-me-refresh-secret'
  ) {
    throw new Error(
      'JWT_SECRET / JWT_REFRESH_SECRET must be set to strong values (placeholder default detected).'
    );
  }
}
