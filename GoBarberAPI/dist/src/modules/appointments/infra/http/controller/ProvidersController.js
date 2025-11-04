"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const class_transformer_1 = require("class-transformer");
const ListProviderService_1 = __importDefault(require("@modules/appointments/services/ListProviderService"));
class ProvidersController {
    async index(request, response) {
        const user_id = request.user.id;
        const listProviders = tsyringe_1.container.resolve(ListProviderService_1.default);
        const providers = await listProviders.execute({
            user_id,
        });
        return response.json((0, class_transformer_1.instanceToInstance)(providers));
    }
}
exports.default = ProvidersController;
