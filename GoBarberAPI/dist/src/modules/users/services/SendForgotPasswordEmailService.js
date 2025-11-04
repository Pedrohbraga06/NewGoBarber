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
const path_1 = __importDefault(require("path"));
const AppError_1 = __importDefault(require("@shared/errors/AppError"));
let SendForgotPasswordEmailService = class SendForgotPasswordEmailService {
    constructor(usersRepository, mailProvider, userTokensRepository) {
        this.usersRepository = usersRepository;
        this.mailProvider = mailProvider;
        this.userTokensRepository = userTokensRepository;
    }
    async execute({ email }) {
        const user = await this.usersRepository.findByEmail(email);
        if (!user) {
            throw new AppError_1.default('User does not exists.');
        }
        const { token } = await this.userTokensRepository.generate(user.id);
        const forgotPasswordTemplate = path_1.default.resolve(__dirname, '..', 'views', 'forgot_password.hbs');
        await this.mailProvider.sendMail({
            to: {
                name: user.name,
                email: user.email,
            },
            subject: '[GoBarber] Recuperação de senha',
            templateData: {
                file: forgotPasswordTemplate,
                variables: {
                    name: user.name,
                    link: `${process.env.APP_WEB_URL}/reset-password?token=${token}`,
                },
            },
        });
    }
};
SendForgotPasswordEmailService = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)('UsersRepository')),
    __param(1, (0, tsyringe_1.inject)('MailProvider')),
    __param(2, (0, tsyringe_1.inject)('UserTokensRepository')),
    __metadata("design:paramtypes", [Object, Object, Object])
], SendForgotPasswordEmailService);
exports.default = SendForgotPasswordEmailService;
