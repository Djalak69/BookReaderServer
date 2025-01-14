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
exports.resetPassword = exports.updateProfile = exports.getProfile = exports.login = exports.register = void 0;
const User_1 = require("../models/User");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (userId) => {
    return jsonwebtoken_1.default.sign({ id: userId }, process.env.JWT_SECRET || 'default_secret', {
        expiresIn: '30d'
    });
};
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, username, password } = req.body;
        // Vérifier si l'utilisateur existe déjà
        const existingUser = yield User_1.User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: 'Un utilisateur avec cet email existe déjà' });
            return;
        }
        // Créer le nouvel utilisateur
        const user = yield User_1.User.create({
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
    }
    catch (error) {
        res.status(500).json({
            message: 'Erreur lors de l\'inscription',
            error: error.message
        });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Trouver l'utilisateur et inclure le mot de passe pour la comparaison
        const user = yield User_1.User.findOne({ email }).select('+password');
        if (!user) {
            res.status(401).json({ message: 'Email ou mot de passe incorrect' });
            return;
        }
        // Vérifier le mot de passe
        const isMatch = yield user.comparePassword(password);
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
    }
    catch (error) {
        res.status(500).json({
            message: 'Erreur lors de la connexion',
            error: error.message
        });
    }
});
exports.login = login;
const getProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const user = yield User_1.User.findById(userId);
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
    }
    catch (error) {
        res.status(500).json({
            message: 'Erreur lors de la récupération du profil',
            error: error.message
        });
    }
});
exports.getProfile = getProfile;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const { username, email } = req.body;
        const user = yield User_1.User.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'Utilisateur non trouvé' });
            return;
        }
        // Vérifier si l'email est déjà utilisé par un autre utilisateur
        if (email && email !== user.email) {
            const existingUser = yield User_1.User.findOne({ email });
            if (existingUser) {
                res.status(400).json({ message: 'Cet email est déjà utilisé' });
                return;
            }
            user.email = email;
        }
        if (username) {
            user.username = username;
        }
        yield user.save();
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
    }
    catch (error) {
        res.status(500).json({
            message: 'Erreur lors de la mise à jour du profil',
            error: error.message
        });
    }
});
exports.updateProfile = updateProfile;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const user = yield User_1.User.findOne({ email });
        if (!user) {
            // Pour des raisons de sécurité, nous ne révélons pas si l'email existe ou non
            res.json({ message: 'Si un compte existe avec cet email, un lien de réinitialisation sera envoyé' });
            return;
        }
        // TODO: Implémenter l'envoi d'email de réinitialisation
        // Pour le moment, nous simulons juste une réponse positive
        res.json({ message: 'Si un compte existe avec cet email, un lien de réinitialisation sera envoyé' });
    }
    catch (error) {
        res.status(500).json({
            message: 'Erreur lors de la demande de réinitialisation du mot de passe',
            error: error.message
        });
    }
});
exports.resetPassword = resetPassword;
//# sourceMappingURL=authController.js.map