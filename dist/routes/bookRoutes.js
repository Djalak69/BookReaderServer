"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const bookController_1 = require("../controllers/bookController");
const router = express_1.default.Router();
// Routes publiques
router.get('/', bookController_1.getBooks);
// Routes protégées
router.get('/user-books', auth_1.protect, bookController_1.getUserBooks);
router.get('/:id/download', auth_1.protect, bookController_1.downloadBook);
exports.default = router;
//# sourceMappingURL=bookRoutes.js.map