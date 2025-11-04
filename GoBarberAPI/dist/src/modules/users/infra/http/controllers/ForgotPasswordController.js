"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const SendForgotPasswordEmailService_1 = __importDefault(require("@modules/users/services/SendForgotPasswordEmailService"));
class ForgotPasswordController {
    async create(request, response) {
        const { email } = request.body;
        const sendForgotPasswordEmail = tsyringe_1.container.resolve(SendForgotPasswordEmailService_1.default);
        await sendForgotPasswordEmail.execute({
            email,
        });
        return response.status(204).json();
    }
}
exports.default = ForgotPasswordController;
