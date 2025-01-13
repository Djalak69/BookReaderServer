import mongoose, { Document, Schema } from 'mongoose';

export interface IBook extends Document {
    title: string;
    author: string;
    description?: string;
    coverUrl?: string;
    epubUrl?: string;
    language: string;
    publishDate?: Date;
    addedDate: Date;
    isDownloaded?: boolean;
    downloadCount?: number;
}

const BookSchema: Schema = new Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    description: { type: String },
    coverUrl: { type: String },
    epubUrl: { type: String },
    language: { type: String, required: true },
    publishDate: { type: Date },
    addedDate: { type: Date, default: Date.now },
    isDownloaded: { type: Boolean, default: false },
    downloadCount: { type: Number, default: 0 }
});

export default mongoose.model<IBook>('Book', BookSchema); 