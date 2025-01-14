"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bookreader';
        console.log('Tentative de connexion à MongoDB...');
        console.log('URL de connexion (masquée):', mongoURI.replace(/mongodb\+srv:\/\/([^:]+):([^@]+)@/, 'mongodb+srv://****:****@'));
        // Configuration de mongoose pour plus de logs
        mongoose_1.default.set('debug', true);
        yield mongoose_1.default.connect(mongoURI, {
            serverSelectionTimeoutMS: 30000, // Augmenté à 30 secondes
            socketTimeoutMS: 60000, // Augmenté à 60 secondes
            maxPoolSize: 10,
            minPoolSize: 2,
            maxIdleTimeMS: 60000, // Augmenté à 60 secondes
            connectTimeoutMS: 60000, // Augmenté à 60 secondes
            heartbeatFrequencyMS: 5000, // Vérifie la connexion toutes les 5 secondes
            waitQueueTimeoutMS: 30000, // Timeout pour la file d'attente
        });
        console.log('MongoDB connecté avec succès !');
        mongoose_1.default.connection.on('error', (err) => {
            console.error('Erreur MongoDB:', err);
        });
        mongoose_1.default.connection.on('disconnected', () => {
            console.log('MongoDB déconnecté - Tentative de reconnexion...');
            (0, exports.connectDB)(); // Tentative de reconnexion automatique
        });
        mongoose_1.default.connection.on('reconnected', () => {
            console.log('MongoDB reconnecté avec succès !');
        });
        // Ajout d'un ping pour vérifier la connexion
        const admin = mongoose_1.default.connection.db.admin();
        yield admin.ping();
        console.log('Ping MongoDB réussi !');
    }
    catch (error) {
        console.error('Erreur de connexion MongoDB:', error);
        console.log('Attente de 10 secondes avant nouvelle tentative...');
        yield new Promise(resolve => setTimeout(resolve, 10000));
        return (0, exports.connectDB)();
    }
});
exports.connectDB = connectDB;
exports.default = exports.connectDB;
//# sourceMappingURL=database.js.map