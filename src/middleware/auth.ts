import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

interface JwtPayload {
    id: string;
}

export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        let token: string | undefined;

        if (req.headers.authorization?.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            res.status(401).json({ message: 'Non autorisé - Token manquant' });
            return;
        }

        try {
            // Vérifier le token
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret') as JwtPayload;

            // Ajouter l'utilisateur à la requête
            const user = await User.findById(decoded.id).select('-password');
            if (!user) {
                res.status(401).json({ message: 'Non autorisé - Utilisateur non trouvé' });
                return;
            }

            (req as any).user = user;
            next();
        } catch (error) {
            res.status(401).json({ message: 'Non autorisé - Token invalide' });
            return;
        }
    } catch (error: any) {
        res.status(500).json({
            message: 'Erreur lors de l\'authentification',
            error: error.message
        });
    }
}; 