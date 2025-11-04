"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const ResetPasswordService_1 = __importDefault(require("@modules/users/services/ResetPasswordService"));
class ResetPasswordController {
    async create(request, response) {
        const { password, token } = request.body;
        const resetPassword = tsyringe_1.container.resolve(ResetPasswordService_1.default);
        await resetPassword.execute({
            token,
            password,
        });
        return response.status(204).json();
    }
}
exports.default = ResetPasswordController;
