import { Request, Response } from 'express';
import { User } from '../models/User';
import jwt from 'jsonwebtoken';

const generateToken = (userId: string): string => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'default_secret', {
        expiresIn: '30d'
    });
};

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, username, password } = req.body;

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: 'Un utilisateur avec cet email existe déjà' });
            return;
        }

        // Créer le nouvel utilisateur
        const user = await User.create({
            email,
            username,
            password
        });

        // Générer le token
        const token = generateToken(user._id);

        res.status(201).json({
            token,
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
                subscriptionStatus: user.subscriptionStatus,
                downloadedBooks: user.downloadedBooks,
                profileImageUrl: user.profileImageUrl
            }
        });
    } catch (error: any) {
        res.status(500).json({
            message: 'Erreur lors de l\'inscription',
            error: error.message
        });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Trouver l'utilisateur et inclure le mot de passe pour la comparaison
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            res.status(401).json({ message: 'Email ou mot de passe incorrect' });
            return;
        }

        // Vérifier le mot de passe
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            res.status(401).json({ message: 'Email ou mot de passe incorrect' });
            return;
        }

        // Générer le token
        const token = generateToken(user._id);

        res.json({
            token,
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
                subscriptionStatus: user.subscriptionStatus,
                downloadedBooks: user.downloadedBooks,
                profileImageUrl: user.profileImageUrl
            }
        });
    } catch (error: any) {
        res.status(500).json({
            message: 'Erreur lors de la connexion',
            error: error.message
        });
    }
};

export const getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user.id;
        const user = await User.findById(userId);
        
        if (!user) {
            res.status(404).json({ message: 'Utilisateur non trouvé' });
            return;
        }

        res.json({
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
                subscriptionStatus: user.subscriptionStatus,
                downloadedBooks: user.downloadedBooks,
                profileImageUrl: user.profileImageUrl
            }
        });
    } catch (error: any) {
        res.status(500).json({
            message: 'Erreur lors de la récupération du profil',
            error: error.message
        });
    }
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user.id;
        const { username, email } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'Utilisateur non trouvé' });
            return;
        }

        // Vérifier si l'email est déjà utilisé par un autre utilisateur
        if (email && email !== user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                res.status(400).json({ message: 'Cet email est déjà utilisé' });
                return;
            }
            user.email = email;
        }

        if (username) {
            user.username = username;
        }

        await user.save();

        res.json({
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
                subscriptionStatus: user.subscriptionStatus,
                downloadedBooks: user.downloadedBooks,
                profileImageUrl: user.profileImageUrl
            }
        });
    } catch (error: any) {
        res.status(500).json({
            message: 'Erreur lors de la mise à jour du profil',
            error: error.message
        });
    }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            // Pour des raisons de sécurité, nous ne révélons pas si l'email existe ou non
            res.json({ message: 'Si un compte existe avec cet email, un lien de réinitialisation sera envoyé' });
            return;
        }

        // TODO: Implémenter l'envoi d'email de réinitialisation
        // Pour le moment, nous simulons juste une réponse positive
        res.json({ message: 'Si un compte existe avec cet email, un lien de réinitialisation sera envoyé' });
    } catch (error: any) {
        res.status(500).json({
            message: 'Erreur lors de la demande de réinitialisation du mot de passe',
            error: error.message
        });
    }
}; 