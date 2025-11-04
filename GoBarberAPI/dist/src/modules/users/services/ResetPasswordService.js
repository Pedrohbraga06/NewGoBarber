"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const date_fns_1 = require("date-fns");
const AppError_1 = __importDefault(require("@shared/errors/AppError"));
let ResetPasswordService = class ResetPasswordService {
    constructor(usersRepository, userTokensRepository, hashProvider) {
        this.usersRepository = usersRepository;
        this.userTokensRepository = userTokensRepository;
        this.hashProvider = hashProvider;
    }
    async execute({ token, password }) {
        const userToken = await this.userTokensRepository.findByToken(token);
        if (!userToken) {
            throw new AppError_1.default('User token does not exists');
        }
        const user = await this.usersRepository.findById(userToken.user_id);
        if (!user) {
            throw new AppError_1.default('User does not exists');
        }
        const tokenCreatedAt = userToken.created_at;
        const compareDate = (0, date_fns_1.addHours)(tokenCreatedAt, 2);
        if ((0, date_fns_1.isAfter)(Date.now(), compareDate)) {
            throw new AppError_1.default('Token expired.');
        }
        user.password = await this.hashProvider.generateHash(password);
        await this.usersRepository.save(user);
    }
};
ResetPasswordService = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)('UsersRepository')),
    __param(1, (0, tsyringe_1.inject)('UserTokensRepository')),
    __param(2, (0, tsyringe_1.inject)('HashProvider')),
    __metadata("design:paramtypes", [Object, Object, Object])
], ResetPasswordService);
exports.default = ResetPasswordService;
