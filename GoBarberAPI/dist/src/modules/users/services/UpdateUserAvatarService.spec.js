"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = __importDefault(require("@shared/errors/AppError"));
const FakeUsersRepository_1 = __importDefault(require("../repositories/fakes/FakeUsersRepository"));
const FakeStorageProvider_1 = __importDefault(require("@shared/container/providers/StorageProvider/fakes/FakeStorageProvider"));
const UpdateUserAvatarService_1 = __importDefault(require("./UpdateUserAvatarService"));
let fakeUsersRepository;
let fakeStorageProvider;
let updateUserAvatar;
describe('UpdateUserAvatar', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository_1.default();
        fakeStorageProvider = new FakeStorageProvider_1.default();
        updateUserAvatar = new UpdateUserAvatarService_1.default(fakeUsersRepository, fakeStorageProvider);
    });
    it('should be able to create a new user', async () => {
        const user = await fakeUsersRepository.create({
            name: 'john Doe',
            email: 'johnDoe@example.com',
            password: '123456',
        });
        await updateUserAvatar.execute({
            user_id: user.id,
            avatarFilename: 'avatar.jpg',
        });
        expect(user.avatar).toBe('avatar.jpg');
    });
    it('should not be able to update a avatar from non existing user', async () => {
        const fakeUsersRepository = new FakeUsersRepository_1.default();
        const fakeStorageProvider = new FakeStorageProvider_1.default();
        const updateUserAvatar = new UpdateUserAvatarService_1.default(fakeUsersRepository, fakeStorageProvider);
        await expect(updateUserAvatar.execute({
            user_id: 'none-existing-user',
            avatarFilename: 'avatar.jpg',
        })).rejects.toBeInstanceOf(AppError_1.default);
    });
    it('should delete old avatar when updating new one', async () => {
        const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');
        const user = await fakeUsersRepository.create({
            name: 'john Doe',
            email: 'johnDoe@example.com',
            password: '123456',
        });
        await updateUserAvatar.execute({
            user_id: user.id,
            avatarFilename: 'avatar.jpg',
        });
        await updateUserAvatar.execute({
            user_id: user.id,
            avatarFilename: 'avatar2.jpg',
        });
        expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');
        expect(user.avatar).toBe('avatar2.jpg');
    });
});
