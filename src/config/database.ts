import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async (): Promise<void> => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bookreader';
        console.log('Tentative de connexion à MongoDB...');
        
        await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 15000,
            socketTimeoutMS: 45000,
            maxPoolSize: 10,
            minPoolSize: 2,
            maxIdleTimeMS: 30000,
            connectTimeoutMS: 30000,
        });

        console.log('MongoDB connecté avec succès !');
        
        mongoose.connection.on('error', (err) => {
            console.error('Erreur MongoDB:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB déconnecté');
        });

        mongoose.connection.on('reconnected', () => {
            console.log('MongoDB reconnecté');
        });

    } catch (error) {
        console.error('Erreur de connexion MongoDB:', error);
        await new Promise(resolve => setTimeout(resolve, 5000));
        return connectDB();
    }
};

export default connectDB; 