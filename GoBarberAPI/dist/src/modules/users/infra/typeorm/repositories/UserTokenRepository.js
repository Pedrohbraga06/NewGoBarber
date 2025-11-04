"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const UserToken_1 = __importDefault(require("../entities/UserToken"));
class UserTokensRepository {
    constructor() {
        this.ormRepository = (0, typeorm_1.getRepository)(UserToken_1.default);
    }
    async findByToken(token) {
        const userToken = await this.ormRepository.findOne({
            where: { token },
        });
        return userToken;
    }
    async generate(user_id) {
        const userToken = this.ormRepository.create({
            user_id,
        });
        await this.ormRepository.save(userToken);
        return userToken;
    }
}
exports.default = UserTokensRepository;
