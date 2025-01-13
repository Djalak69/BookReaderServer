import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

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
        select: false // Ne pas inclure par défaut dans les requêtes
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

// Middleware pour hasher le mot de passe avant la sauvegarde
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

// Méthode pour comparer les mots de passe
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw error;
    }
};

// Méthode pour vérifier si l'utilisateur peut télécharger plus de livres
userSchema.methods.canDownloadMoreBooks = function(): boolean {
    const limits = {
        none: 0,
        monthly: 3,
        yearly: 3
    };
    return this.downloadedBooks < limits[this.subscriptionStatus];
};

// Méthode pour obtenir le nombre de téléchargements restants
userSchema.methods.getRemainingDownloads = function(): number {
    const limits = {
        none: 0,
        monthly: 3,
        yearly: 3
    };
    return Math.max(0, limits[this.subscriptionStatus] - this.downloadedBooks);
};

export const User = mongoose.model<IUser>('User', userSchema); 