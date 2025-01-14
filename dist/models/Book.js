"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Book = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const bookSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    language: {
        type: String,
        required: true,
        default: 'fr'
    },
    publishDate: {
        type: Date,
        default: Date.now
    },
    addedDate: {
        type: Date,
        default: Date.now
    },
    isDownloaded: {
        type: Boolean,
        default: false
    },
    downloadCount: {
        type: Number,
        default: 0
    },
    readingProgress: {
        type: Number,
        default: 0
    },
    lastReadPosition: {
        type: Number,
        default: 0
    },
    epubUrl: {
        type: String,
        required: true
    },
    coverUrl: {
        type: String
    },
    downloadedBy: [{
            user: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: 'User'
            },
            downloadDate: {
                type: Date,
                default: Date.now
            }
        }]
});
exports.Book = mongoose_1.default.model('Book', bookSchema);
//# sourceMappingURL=Book.js.map