"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Routes publiques
router.post('/register', authController_1.register);
router.post('/login', authController_1.login);
router.post('/reset-password', authController_1.resetPassword);
// Routes protégées
router.get('/profile', auth_1.protect, authController_1.getProfile);
router.put('/profile', auth_1.protect, authController_1.updateProfile);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map