"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AuthenticateUserService_1 = __importDefault(require("@modules/users/services/AuthenticateUserService"));
const tsyringe_1 = require("tsyringe");
class SessionsController {
    async create(request, response) {
        const { email, password } = request.body;
        const authenticateuser = tsyringe_1.container.resolve(AuthenticateUserService_1.default);
        const { user, token } = await authenticateuser.execute({
            email,
            password,
        });
        const userWithoutPassword = {
            id: user.id,
            name: user.name,
            email: user.email,
            created_at: user.created_at,
            updated_at: user.updated_at,
        };
        return response.json({ user: userWithoutPassword, token });
    }
}
exports.default = SessionsController;
