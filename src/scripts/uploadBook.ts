import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Book } from '../models/Book';

dotenv.config();

// Configuration MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bookreader';
const BASE_URL = 'https://bookreaderserver.onrender.com';

// Fonction pour copier un fichier
async function copyFile(source: string, destination: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const readStream = fs.createReadStream(source);
        const writeStream = fs.createWriteStream(destination);

        readStream.on('error', reject);
        writeStream.on('error', reject);
        writeStream.on('finish', resolve);

        readStream.pipe(writeStream);
    });
}

// Fonction principale pour uploader un livre
async function uploadBook(
    epubPath: string,
    coverPath: string | null,
    bookInfo: {
        title: string;
        author: string;
        description?: string;
        language?: string;
        publishDate?: Date;
    }
) {
    try {
        // Connexion à MongoDB
        await mongoose.connect(MONGODB_URI);
        console.log('Connecté à MongoDB');

        // Créer les dossiers de destination s'ils n'existent pas
        const publicPath = path.join(__dirname, '../../public');
        const booksPath = path.join(publicPath, 'books');
        const coversPath = path.join(publicPath, 'covers');

        if (!fs.existsSync(booksPath)) {
            fs.mkdirSync(booksPath, { recursive: true });
        }
        if (!fs.existsSync(coversPath)) {
            fs.mkdirSync(coversPath, { recursive: true });
        }

        // Générer des noms de fichiers uniques
        const epubFileName = `${Date.now()}-${path.basename(epubPath)}`;
        const epubDestination = path.join(booksPath, epubFileName);

        // Copier le fichier EPUB
        await copyFile(epubPath, epubDestination);
        console.log('Fichier EPUB copié avec succès');

        let coverFileName = null;
        if (coverPath) {
            coverFileName = `${Date.now()}-${path.basename(coverPath)}`;
            const coverDestination = path.join(coversPath, coverFileName);
            await copyFile(coverPath, coverDestination);
            console.log('Couverture copiée avec succès');
        }

        // Créer l'entrée dans la base de données
        const book = new Book({
            ...bookInfo,
            epubUrl: `${BASE_URL}/books/${epubFileName}`,
            coverUrl: coverFileName ? `${BASE_URL}/covers/${coverFileName}` : null
        });

        await book.save();
        console.log('Livre enregistré dans la base de données');

        console.log('Upload terminé avec succès !');
        console.log('ID du livre:', book._id);
    } catch (error) {
        console.error('Erreur lors de l\'upload:', error);
    } finally {
        await mongoose.disconnect();
    }
}

// Exemple d'utilisation
if (require.main === module) {
    const args = process.argv.slice(2);
    if (args.length < 3) {
        console.log('Usage: ts-node uploadBook.ts <chemin_epub> <titre> <auteur> [chemin_couverture] [description] [langue]');
        process.exit(1);
    }

    const [epubPath, title, author, coverPath, description, language] = args;

    uploadBook(epubPath, coverPath || null, {
        title,
        author,
        description,
        language: language || 'fr',
        publishDate: new Date()
    }).catch(console.error);
} 