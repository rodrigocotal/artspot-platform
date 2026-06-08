import rateLimit from 'express-rate-limit';

// NOTE: per-IP limits rely on `app.set('trust proxy', 1)` (see app.ts) so the
// key is the real client IP, not the App Runner proxy. Thresholds are per
// client per minute.

/** Auth endpoints: brute-force protection while tolerating fat-fingered logins. */
export const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later' },
});

/** Inquiry submission: anti-spam, but allows inquiring on several artworks. */
export const inquiryLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many inquiries, please try again later' },
});

/** Contact form submission. */
export const contactLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many messages, please try again later' },
});

/** General API: generous per-client cap for an XHR-heavy SPA (~5 req/s). */
export const generalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later' },
});
