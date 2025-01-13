import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import connectDB from './config/database';
import bookRoutes from './routes/bookRoutes';
import authRoutes from './routes/authRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connexion à la base de données
connectDB();

// Configuration CORS
const corsOptions = {
    origin: process.env.NODE_ENV === 'production' 
        ? '*'  // En production, accepter toutes les origines
        : 'http://localhost:3000', // En développement, uniquement localhost
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers statiques
app.use('/books', express.static(path.join(__dirname, '../public/books')));
app.use('/covers', express.static(path.join(__dirname, '../public/covers')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);

// Route de test
app.get('/', (req, res) => {
    res.json({
        message: 'BookReader API est en ligne !',
        endpoints: {
            auth: '/api/auth',
            books: '/api/books'
        },
        version: '1.0.0',
        environment: process.env.NODE_ENV
    });
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur le port ${PORT} en mode ${process.env.NODE_ENV}`);
}); 