import express from 'express';
import { register, login, getProfile, updateProfile, resetPassword } from '../controllers/authController';
import { protect } from '../middleware/auth';

const router = express.Router();

// Routes publiques
router.post('/register', register);
router.post('/login', login);
router.post('/reset-password', resetPassword);

// Routes protégées
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

export default router; 