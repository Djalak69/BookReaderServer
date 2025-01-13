import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

interface DownloadLimits {
    none: number;
    monthly: number;
    yearly: number;
}

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

const userSchema = new Schema<IUser>({
    email: {
        type: String,
        required: [true, 'L\'email est requis'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Format d\'email invalide']
    },
    username: {
        type: String,
        required: [true, 'Le nom d\'utilisateur est requis'],
        trim: true,
        minlength: [3, 'Le nom d\'utilisateur doit contenir au moins 3 caractères']
    },
    password: {
        type: String,
        required: [true, 'Le mot de passe est requis'],
        minlength: [8, 'Le mot de passe doit contenir au moins 8 caractères'],
        select: false
    },
    profileImageUrl: {
        type: String,
        default: null
    },
    subscriptionStatus: {
        type: String,
        enum: ['none', 'monthly', 'yearly'],
        default: 'none'
    },
    downloadedBooks: {
        type: Number,
        default: 0
    },
    lastSubscriptionRenewal: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error: any) {
        next(error);
    }
});

userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw error;
    }
};

const downloadLimits: DownloadLimits = {
    none: 0,
    monthly: 3,
    yearly: 3
};

userSchema.methods.canDownloadMoreBooks = function(): boolean {
    return this.downloadedBooks < downloadLimits[this.subscriptionStatus as keyof DownloadLimits];
};

userSchema.methods.getRemainingDownloads = function(): number {
    return Math.max(0, downloadLimits[this.subscriptionStatus as keyof DownloadLimits] - this.downloadedBooks);
};

export const User = mongoose.model<IUser>('User', userSchema); 