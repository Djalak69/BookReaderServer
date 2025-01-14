import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
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
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        downloadDate: {
            type: Date,
            default: Date.now
        }
    }]
});

export const Book = mongoose.model('Book', bookSchema); 