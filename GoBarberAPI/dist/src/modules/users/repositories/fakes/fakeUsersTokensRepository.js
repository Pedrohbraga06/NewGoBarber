"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const UserToken_1 = __importDefault(require("../../infra/typeorm/entities/UserToken"));
class FakeUserTokensRepository {
    constructor() {
        this.userTokens = [];
    }
    async generate(user_id) {
        const userToken = new UserToken_1.default();
        Object.assign(userToken, {
            id: (0, uuid_1.v4)(),
            token: (0, uuid_1.v4)(),
            user_id,
            created_at: new Date(),
            updated_at: new Date(),
        });
        this.userTokens.push(userToken);
        return userToken;
    }
    async findByToken(token) {
        const userToken = this.userTokens.find(findToken => findToken.token === token);
        return userToken;
    }
}
exports.default = FakeUserTokensRepository;
