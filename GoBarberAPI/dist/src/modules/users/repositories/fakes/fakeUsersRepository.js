"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const User_1 = __importDefault(require("../../infra/typeorm/entities/User"));
class FakeUsersRepository {
    constructor() {
        this.users = [];
    }
    async findById(id) {
        const findUser = this.users.find(user => user.id === id);
        return findUser;
    }
    async findByEmail(email) {
        const findUser = this.users.find(user => user.email === email);
        return findUser;
    }
    async findAllProviders({ except_user_id, }) {
        let { users } = this;
        if (except_user_id) {
            users = this.users.filter(user => user.id !== except_user_id);
        }
        return users;
    }
    async create(userData) {
        const user = new User_1.default();
        Object.assign(user, { id: (0, uuid_1.v4)() }, userData);
        this.users.push(user);
        return user;
    }
    async save(user) {
        const findIndex = this.users.findIndex(findUser => findUser.id === user.id);
        this.users[findIndex] = user;
        return user;
    }
}
exports.default = FakeUsersRepository;
