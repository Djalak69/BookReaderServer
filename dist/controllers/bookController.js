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
exports.deleteBook = exports.updateBook = exports.createBook = exports.getBookById = exports.getBooks = void 0;
const Book_1 = __importDefault(require("../models/Book"));
// Obtenir tous les livres
const getBooks = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const books = yield Book_1.default.find();
        res.status(200).json(books);
    }
    catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des livres", error });
    }
});
exports.getBooks = getBooks;
// Obtenir un livre par son ID
const getBookById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const book = yield Book_1.default.findById(req.params.id);
        if (!book) {
            res.status(404).json({ message: "Livre non trouvé" });
            return;
        }
        res.status(200).json(book);
    }
    catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération du livre", error });
    }
});
exports.getBookById = getBookById;
// Créer un nouveau livre
const createBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const book = new Book_1.default(req.body);
        const savedBook = yield book.save();
        res.status(201).json(savedBook);
    }
    catch (error) {
        res.status(500).json({ message: "Erreur lors de la création du livre", error });
    }
});
exports.createBook = createBook;
// Mettre à jour un livre
const updateBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const book = yield Book_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!book) {
            res.status(404).json({ message: "Livre non trouvé" });
            return;
        }
        res.status(200).json(book);
    }
    catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour du livre", error });
    }
});
exports.updateBook = updateBook;
// Supprimer un livre
const deleteBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const book = yield Book_1.default.findByIdAndDelete(req.params.id);
        if (!book) {
            res.status(404).json({ message: "Livre non trouvé" });
            return;
        }
        res.status(200).json({ message: "Livre supprimé avec succès" });
    }
    catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression du livre", error });
    }
});
exports.deleteBook = deleteBook;
