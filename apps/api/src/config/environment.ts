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
    fromEmail: process.env.FROM_EMAIL || 'noreply@artaldo.com',
    staffEmail: process.env.STAFF_EMAIL || '',
    awsRegion: process.env.AWS_SES_REGION || process.env.AWS_REGION || 'ap-southeast-2',
  },

  // Stripe
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
    successUrl: process.env.STRIPE_SUCCESS_URL || 'http://localhost:3000/checkout/success',
    cancelUrl: process.env.STRIPE_CANCEL_URL || 'http://localhost:3000/checkout/cancel',
  },
} as const;

// Validate required environment variables in production
if (config.nodeEnv === 'production') {
  const required = ['DATABASE_URL', 'JWT_SECRET', 'JWT_REFRESH_SECRET', 'STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET'];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }
}
