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
exports.getUserBooks = exports.downloadBook = exports.getBooks = void 0;
const Book_1 = require("../models/Book");
const User_1 = require("../models/User");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const DOWNLOADS_PER_MONTH = 3;
const getBooks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const books = yield Book_1.Book.find();
        res.json(books);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getBooks = getBooks;
const downloadBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const bookId = req.params.id;
        // Vérifier si le livre existe
        const book = yield Book_1.Book.findById(bookId);
        if (!book) {
            res.status(404).json({ message: 'Livre non trouvé' });
            return;
        }
        // Vérifier les téléchargements du mois
        const user = yield User_1.User.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'Utilisateur non trouvé' });
            return;
        }
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthlyDownloads = yield Book_1.Book.countDocuments({
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
        const filePath = path_1.default.join(__dirname, '../../public', book.epubUrl);
        if (!fs_1.default.existsSync(filePath)) {
            res.status(404).json({ message: 'Fichier non trouvé' });
            return;
        }
        // Mettre à jour les informations de téléchargement
        book.downloadedBy.push({
            user: userId,
            downloadDate: new Date()
        });
        book.downloadCount = (book.downloadCount || 0) + 1;
        yield book.save();
        // Envoyer le fichier
        res.download(filePath);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.downloadBook = downloadBook;
const getUserBooks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const books = yield Book_1.Book.find({
            'downloadedBy.user': userId
        });
        res.json(books);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getUserBooks = getUserBooks;
//# sourceMappingURL=bookController.js.map