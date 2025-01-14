import express from 'express';
import { protect } from '../middleware/auth';
import {
    getBooks,
    downloadBook,
    getUserBooks
} from '../controllers/bookController';

const router = express.Router();

// Routes publiques
router.get('/', getBooks);

// Routes protégées
router.get('/user-books', protect, getUserBooks);
router.get('/:id/download', protect, downloadBook);

export default router; 