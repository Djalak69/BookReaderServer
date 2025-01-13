import { Request, Response } from 'express';
import Book, { IBook } from '../models/Book';

// Obtenir tous les livres
export const getBooks = async (_req: Request, res: Response): Promise<void> => {
    try {
        const books = await Book.find();
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des livres", error });
    }
};

// Obtenir un livre par son ID
export const getBookById = async (req: Request, res: Response): Promise<void> => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            res.status(404).json({ message: "Livre non trouvé" });
            return;
        }
        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération du livre", error });
    }
};

// Créer un nouveau livre
export const createBook = async (req: Request, res: Response): Promise<void> => {
    try {
        const book = new Book(req.body);
        const savedBook = await book.save();
        res.status(201).json(savedBook);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la création du livre", error });
    }
};

// Mettre à jour un livre
export const updateBook = async (req: Request, res: Response): Promise<void> => {
    try {
        const book = await Book.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!book) {
            res.status(404).json({ message: "Livre non trouvé" });
            return;
        }
        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour du livre", error });
    }
};

// Supprimer un livre
export const deleteBook = async (req: Request, res: Response): Promise<void> => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) {
            res.status(404).json({ message: "Livre non trouvé" });
            return;
        }
        res.status(200).json({ message: "Livre supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression du livre", error });
    }
}; 