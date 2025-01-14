import mongoose, { Document } from 'mongoose';
export interface IUser extends Document {
    email: string;
    username: string;
    password: string;
    profileImageUrl?: string;
    subscriptionStatus: 'none' | 'monthly' | 'yearly';
    downloadedBooks: number;
    lastSubscriptionRenewal?: Date;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
    canDownloadMoreBooks(): boolean;
    getRemainingDownloads(): number;
}
export declare const User: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser> & IUser & {
    _id: mongoose.Types.ObjectId;
}, any>;
