"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const Book_1 = require("../models/Book");
dotenv_1.default.config();
// Configuration MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bookreader';
const BASE_URL = 'https://bookreaderserver.onrender.com';
// Fonction pour copier un fichier
function copyFile(source, destination) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const readStream = fs_1.default.createReadStream(source);
            const writeStream = fs_1.default.createWriteStream(destination);
            readStream.on('error', reject);
            writeStream.on('error', reject);
            writeStream.on('finish', resolve);
            readStream.pipe(writeStream);
        });
    });
}
// Fonction principale pour uploader un livre
function uploadBook(epubPath, coverPath, bookInfo) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Connexion à MongoDB
            yield mongoose_1.default.connect(MONGODB_URI);
            console.log('Connecté à MongoDB');
            // Créer les dossiers de destination s'ils n'existent pas
            const publicPath = path_1.default.join(__dirname, '../../public');
            const booksPath = path_1.default.join(publicPath, 'books');
            const coversPath = path_1.default.join(publicPath, 'covers');
            if (!fs_1.default.existsSync(booksPath)) {
                fs_1.default.mkdirSync(booksPath, { recursive: true });
            }
            if (!fs_1.default.existsSync(coversPath)) {
                fs_1.default.mkdirSync(coversPath, { recursive: true });
            }
            // Générer des noms de fichiers uniques
            const epubFileName = `${Date.now()}-${path_1.default.basename(epubPath)}`;
            const epubDestination = path_1.default.join(booksPath, epubFileName);
            // Copier le fichier EPUB
            yield copyFile(epubPath, epubDestination);
            console.log('Fichier EPUB copié avec succès');
            let coverFileName = null;
            if (coverPath) {
                coverFileName = `${Date.now()}-${path_1.default.basename(coverPath)}`;
                const coverDestination = path_1.default.join(coversPath, coverFileName);
                yield copyFile(coverPath, coverDestination);
                console.log('Couverture copiée avec succès');
            }
            // Créer l'entrée dans la base de données
            const book = new Book_1.Book(Object.assign(Object.assign({}, bookInfo), { epubUrl: `${BASE_URL}/books/${epubFileName}`, coverUrl: coverFileName ? `${BASE_URL}/covers/${coverFileName}` : null }));
            yield book.save();
            console.log('Livre enregistré dans la base de données');
            console.log('Upload terminé avec succès !');
            console.log('ID du livre:', book._id);
        }
        catch (error) {
            console.error('Erreur lors de l\'upload:', error);
        }
        finally {
            yield mongoose_1.default.disconnect();
        }
    });
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
//# sourceMappingURL=uploadBook.js.map