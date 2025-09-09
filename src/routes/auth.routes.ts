import { Router } from 'express';
import authController from '../controllers/auth.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validateRequest.js';

const router = Router();

// Public routes
router.post('/register', validate, authController.register);
router.post('/login', authController.login);

// Protected routes (require authentication)
router.use(protect);
router.post('/logout', authController.logout);
router.get('/me', authController.getMe);

export default router;
