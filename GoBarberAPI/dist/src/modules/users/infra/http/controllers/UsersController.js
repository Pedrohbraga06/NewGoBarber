"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CreateUserService_1 = __importDefault(require("@modules/users/services/CreateUserService"));
const tsyringe_1 = require("tsyringe");
class UsersController {
    async create(request, response) {
        const { name, email, password } = request.body;
        const createUser = tsyringe_1.container.resolve(CreateUserService_1.default);
        const user = await createUser.execute({
            name,
            email,
            password,
        });
        // Com a atualização do TypeScript, isso se faz necessário
        const userWithoutPassword = {
            id: user.id,
            name: user.name,
            email: user.email,
            created_at: user.created_at,
            updated_at: user.updated_at,
        };
        return response.json(userWithoutPassword);
    }
}
exports.default = UsersController;
