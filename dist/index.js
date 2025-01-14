"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const database_1 = __importDefault(require("./config/database"));
const bookRoutes_1 = __importDefault(require("./routes/bookRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Connexion à la base de données
(0, database_1.default)();
// Configuration CORS
const corsOptions = {
    origin: process.env.NODE_ENV === 'production'
        ? '*'
        : 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};
// Middleware
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Servir les fichiers statiques
app.use('/books', express_1.default.static(path_1.default.join(__dirname, '../public/books')));
app.use('/covers', express_1.default.static(path_1.default.join(__dirname, '../public/covers')));
// Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/books', bookRoutes_1.default);
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
//# sourceMappingURL=index.js.map