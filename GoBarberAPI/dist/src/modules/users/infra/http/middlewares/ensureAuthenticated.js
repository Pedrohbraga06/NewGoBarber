"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ensureAuthenticated;
const jsonwebtoken_1 = require("jsonwebtoken");
const AppError_1 = __importDefault(require("@shared/errors/AppError"));
const auth_1 = __importDefault(require("@config/auth"));
function ensureAuthenticated(request, response, next) {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
        throw new AppError_1.default('JWT token is missing', 401);
    }
    const [scheme, token] = authHeader.split(' ');
    if (scheme !== 'Bearer' || !token) {
        throw new AppError_1.default('Invalid token format', 401);
    }
    try {
        const decoded = (0, jsonwebtoken_1.verify)(token, auth_1.default.jwt.secret);
        const { sub } = decoded;
        request.user = {
            id: sub,
        };
        return next();
    }
    catch (error) {
        if (error instanceof Error && error.name === 'TokenExpiredError') {
            throw new AppError_1.default('Token expired', 401);
        }
        throw new AppError_1.default('Invalid JWT token', 401);
    }
}
