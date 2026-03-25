"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = __importDefault(require("@shared/errors/AppError"));
const FakeUsersRepository_1 = __importDefault(require("../repositories/fakes/FakeUsersRepository"));
const FakeHashProvider_1 = __importDefault(require("../providers/HashProvider/fakes/FakeHashProvider"));
const CreateUserService_1 = __importDefault(require("./CreateUserService"));
let fakeUsersRepository;
let fakeHashProvider;
let CreateUser;
describe('CreateUser', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository_1.default();
        fakeHashProvider = new FakeHashProvider_1.default();
        CreateUser = new CreateUserService_1.default(fakeUsersRepository, fakeHashProvider);
    });
    it('should be able to create a new user', async () => {
        const user = await CreateUser.execute({
            name: 'john Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });
        expect(user).toHaveProperty('id');
    });
    it('should not be able to create a new user with same email from another', async () => {
        await CreateUser.execute({
            name: 'john Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });
        await expect(CreateUser.execute({
            name: 'john Doe',
            email: 'johndoe@example.com',
            password: '123456',
        })).rejects.toBeInstanceOf(AppError_1.default);
    });
});
