import { Request, Response } from 'express';
import { Book } from '../models/Book';
import { User } from '../models/User';
import path from 'path';
import fs from 'fs';

const DOWNLOADS_PER_MONTH = 3;

export const getBooks = async (req: Request, res: Response): Promise<void> => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const downloadBook = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user.id;
        const bookId = req.params.id;

        // Vérifier si le livre existe
        const book = await Book.findById(bookId);
        if (!book) {
            res.status(404).json({ message: 'Livre non trouvé' });
            return;
        }

        // Vérifier les téléchargements du mois
        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'Utilisateur non trouvé' });
            return;
        }

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        
        const monthlyDownloads = await Book.countDocuments({
            'downloadedBy': {
                $elemMatch: {
                    user: userId,
                    downloadDate: { $gte: startOfMonth }
                }
            }
        });

        if (monthlyDownloads >= DOWNLOADS_PER_MONTH) {
            res.status(403).json({ 
                message: 'Limite de téléchargements mensuels atteinte',
                monthlyDownloads,
                limit: DOWNLOADS_PER_MONTH
            });
            return;
        }

        // Vérifier si le fichier existe
        const filePath = path.join(__dirname, '../../public', book.epubUrl);
        if (!fs.existsSync(filePath)) {
            res.status(404).json({ message: 'Fichier non trouvé' });
            return;
        }

        // Mettre à jour les informations de téléchargement
        book.downloadedBy.push({ 
            user: userId,
            downloadDate: new Date()
        });
        book.downloadCount = (book.downloadCount || 0) + 1;
        await book.save();

        // Envoyer le fichier
        res.download(filePath);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getUserBooks = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user.id;
        
        const books = await Book.find({
            'downloadedBy.user': userId
        });

        res.json(books);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}; 