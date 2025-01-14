import mongoose from 'mongoose';
export declare const Book: mongoose.Model<{
    title: string;
    author: string;
    language: string;
    publishDate: Date;
    addedDate: Date;
    isDownloaded: boolean;
    downloadCount: number;
    readingProgress: number;
    lastReadPosition: number;
    epubUrl: string;
    downloadedBy: {
        downloadDate: Date;
        user?: mongoose.Types.ObjectId | undefined;
    }[];
    description?: string | undefined;
    coverUrl?: string | undefined;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    title: string;
    author: string;
    language: string;
    publishDate: Date;
    addedDate: Date;
    isDownloaded: boolean;
    downloadCount: number;
    readingProgress: number;
    lastReadPosition: number;
    epubUrl: string;
    downloadedBy: {
        downloadDate: Date;
        user?: mongoose.Types.ObjectId | undefined;
    }[];
    description?: string | undefined;
    coverUrl?: string | undefined;
}> & {
    title: string;
    author: string;
    language: string;
    publishDate: Date;
    addedDate: Date;
    isDownloaded: boolean;
    downloadCount: number;
    readingProgress: number;
    lastReadPosition: number;
    epubUrl: string;
    downloadedBy: {
        downloadDate: Date;
        user?: mongoose.Types.ObjectId | undefined;
    }[];
    description?: string | undefined;
    coverUrl?: string | undefined;
} & {
    _id: mongoose.Types.ObjectId;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    title: string;
    author: string;
    language: string;
    publishDate: Date;
    addedDate: Date;
    isDownloaded: boolean;
    downloadCount: number;
    readingProgress: number;
    lastReadPosition: number;
    epubUrl: string;
    downloadedBy: {
        downloadDate: Date;
        user?: mongoose.Types.ObjectId | undefined;
    }[];
    description?: string | undefined;
    coverUrl?: string | undefined;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    title: string;
    author: string;
    language: string;
    publishDate: Date;
    addedDate: Date;
    isDownloaded: boolean;
    downloadCount: number;
    readingProgress: number;
    lastReadPosition: number;
    epubUrl: string;
    downloadedBy: {
        downloadDate: Date;
        user?: mongoose.Types.ObjectId | undefined;
    }[];
    description?: string | undefined;
    coverUrl?: string | undefined;
}>> & mongoose.FlatRecord<{
    title: string;
    author: string;
    language: string;
    publishDate: Date;
    addedDate: Date;
    isDownloaded: boolean;
    downloadCount: number;
    readingProgress: number;
    lastReadPosition: number;
    epubUrl: string;
    downloadedBy: {
        downloadDate: Date;
        user?: mongoose.Types.ObjectId | undefined;
    }[];
    description?: string | undefined;
    coverUrl?: string | undefined;
}> & {
    _id: mongoose.Types.ObjectId;
}>>;
