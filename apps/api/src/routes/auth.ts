import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// POST /auth/register
router.post('/register', authController.register.bind(authController));

// POST /auth/login
router.post('/login', authController.login.bind(authController));

// POST /auth/refresh
router.post('/refresh', authController.refresh.bind(authController));

// POST /auth/logout
router.post('/logout', authController.logout.bind(authController));

// GET /auth/profile (protected)
router.get('/profile', authenticate, authController.getProfile.bind(authController));

// POST /auth/forgot-password
router.post('/forgot-password', authController.forgotPassword.bind(authController));

// POST /auth/reset-password
router.post('/reset-password', authController.resetPassword.bind(authController));

// PATCH /auth/profile (protected)
router.patch('/profile', authenticate, authController.updateProfile.bind(authController));

// POST /auth/change-password (protected)
router.post('/change-password', authenticate, authController.changePassword.bind(authController));

export default router;
