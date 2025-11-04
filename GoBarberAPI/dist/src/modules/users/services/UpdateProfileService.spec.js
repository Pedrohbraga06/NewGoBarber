"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = __importDefault(require("@shared/errors/AppError"));
const FakeHashProvider_1 = __importDefault(require("../providers/HashProvider/fakes/FakeHashProvider"));
const fakeUsersRepository_1 = __importDefault(require("../repositories/fakes/fakeUsersRepository"));
const UpdateProfileSevice_1 = __importDefault(require("./UpdateProfileSevice"));
let fakeUsersRepository;
let fakeHashProvider;
let updateProfile;
describe('UpdateProfile', () => {
    beforeEach(() => {
        fakeUsersRepository = new fakeUsersRepository_1.default();
        fakeHashProvider = new FakeHashProvider_1.default();
        updateProfile = new UpdateProfileSevice_1.default(fakeUsersRepository, fakeHashProvider);
    });
    it('should be able update the profile', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });
        const updatedUser = await updateProfile.execute({
            user_id: user.id,
            name: 'John Trê',
            email: 'johntre@example.com',
        });
        expect(updatedUser.name).toBe('John Trê');
        expect(updatedUser.email).toBe('johntre@example.com');
    });
    it('should not be able update the profile from non-existing user', async () => {
        expect(updateProfile.execute({
            user_id: 'non-existing-user-id',
            name: 'Test',
            email: 'test@example.com',
        })).rejects.toBeInstanceOf(AppError_1.default);
    });
    it('should not be able to change to another user email', async () => {
        await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });
        const user = await fakeUsersRepository.create({
            name: 'Test',
            email: 'test@example.com',
            password: '123456',
        });
        await expect(updateProfile.execute({
            user_id: user.id,
            name: 'John Doe',
            email: 'johndoe@example.com',
        })).rejects.toBeInstanceOf(AppError_1.default);
    });
    it('should be able to update the password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });
        const updatedUser = await updateProfile.execute({
            user_id: user.id,
            name: 'John Trê',
            email: 'johntre@example.com',
            old_password: '123456',
            password: '123123',
        });
        expect(updatedUser.password).toBe('123123');
    });
    it('should not be able to update the password without old password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });
        await expect(updateProfile.execute({
            user_id: user.id,
            name: 'John Trê',
            email: 'johntre@example.com',
            password: '123123',
        })).rejects.toBeInstanceOf(AppError_1.default);
    });
    it('should not be able to update the password with wrong old password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });
        await expect(updateProfile.execute({
            user_id: user.id,
            name: 'John Trê',
            email: 'johntre@example.com',
            old_password: 'wrong-old-password',
            password: '123123',
        })).rejects.toBeInstanceOf(AppError_1.default);
    });
});
