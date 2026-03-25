"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = __importDefault(require("@shared/errors/AppError"));
const FakeMailProvider_1 = __importDefault(require("@shared/container/providers/MailProvider/fakes/FakeMailProvider"));
const SendForgotPasswordEmailService_1 = __importDefault(require("./SendForgotPasswordEmailService"));
const FakeUserTokensRepository_1 = __importDefault(require("../repositories/fakes/FakeUserTokensRepository"));
const FakeUsersRepository_1 = __importDefault(require("../repositories/fakes/FakeUsersRepository"));
let fakeUsersRepository;
let fakeUserTokensRepository;
let fakeMailProvider;
let sendForgotPasswordEmail;
describe('SendForgotPasswordEmail', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository_1.default();
        fakeMailProvider = new FakeMailProvider_1.default();
        fakeUserTokensRepository = new FakeUserTokensRepository_1.default();
        sendForgotPasswordEmail = new SendForgotPasswordEmailService_1.default(fakeUsersRepository, fakeMailProvider, fakeUserTokensRepository);
    });
    it('should be able to recover the password using the email', async () => {
        const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');
        await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });
        await sendForgotPasswordEmail.execute({
            email: 'johndoe@example.com',
        });
        expect(sendMail).toHaveBeenCalled();
    });
    it('should not be able to recover a non-existing user password', async () => {
        await expect(sendForgotPasswordEmail.execute({
            email: 'johndoe@example.com',
        })).rejects.toBeInstanceOf(AppError_1.default);
    });
    it('should generate a forgot passsword token', async () => {
        const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });
        await sendForgotPasswordEmail.execute({
            email: 'johndoe@example.com',
        });
        expect(generateToken).toHaveBeenCalledWith(user.id);
    });
});
