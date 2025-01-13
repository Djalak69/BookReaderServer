import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async (): Promise<void> => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bookreader';
        console.log('Tentative de connexion à MongoDB...');
        console.log('URL de connexion (masquée):', mongoURI.replace(/mongodb\+srv:\/\/([^:]+):([^@]+)@/, 'mongodb+srv://****:****@'));
        
        // Configuration de mongoose pour plus de logs
        mongoose.set('debug', true);
        
        await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 30000, // Augmenté à 30 secondes
            socketTimeoutMS: 60000,          // Augmenté à 60 secondes
            maxPoolSize: 10,
            minPoolSize: 2,
            maxIdleTimeMS: 60000,            // Augmenté à 60 secondes
            connectTimeoutMS: 60000,         // Augmenté à 60 secondes
            heartbeatFrequencyMS: 5000,      // Vérifie la connexion toutes les 5 secondes
            waitQueueTimeoutMS: 30000,       // Timeout pour la file d'attente
        });

        console.log('MongoDB connecté avec succès !');
        
        mongoose.connection.on('error', (err) => {
            console.error('Erreur MongoDB:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB déconnecté - Tentative de reconnexion...');
            connectDB(); // Tentative de reconnexion automatique
        });

        mongoose.connection.on('reconnected', () => {
            console.log('MongoDB reconnecté avec succès !');
        });

        // Ajout d'un ping pour vérifier la connexion
        const admin = mongoose.connection.db.admin();
        await admin.ping();
        console.log('Ping MongoDB réussi !');

    } catch (error) {
        console.error('Erreur de connexion MongoDB:', error);
        console.log('Attente de 10 secondes avant nouvelle tentative...');
        await new Promise(resolve => setTimeout(resolve, 10000));
        return connectDB();
    }
};

export default connectDB; 