"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = __importDefault(require("@shared/errors/AppError"));
const fakeUsersRepository_1 = __importDefault(require("../repositories/fakes/fakeUsersRepository"));
const ShowProfileService_1 = __importDefault(require("./ShowProfileService"));
let fakeUsersRepository;
let showProfile;
describe('ShowProfile', () => {
    beforeEach(() => {
        fakeUsersRepository = new fakeUsersRepository_1.default();
        showProfile = new ShowProfileService_1.default(fakeUsersRepository);
    });
    it('should be able show the profile', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });
        const profile = await showProfile.execute({
            user_id: user.id,
        });
        expect(profile.name).toBe('John Doe');
        expect(profile.email).toBe('johndoe@example.com');
    });
    it('should not be able show the profile from non-existing user', async () => {
        await expect(showProfile.execute({
            user_id: 'non-existing-user-id',
        })).rejects.toBeInstanceOf(AppError_1.default);
    });
});
