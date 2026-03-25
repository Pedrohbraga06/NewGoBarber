"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const FakeUsersRepository_1 = __importDefault(require("@modules/users/repositories/fakes/FakeUsersRepository"));
const FakeCacheProvider_1 = __importDefault(require("@shared/container/providers/CacheProvider/fakes/FakeCacheProvider"));
const ListProviderService_1 = __importDefault(require("./ListProviderService"));
let fakeUsersRepository;
let fakeCacheProvider;
let listProviders;
describe('ListProviders', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository_1.default();
        fakeCacheProvider = new FakeCacheProvider_1.default();
        listProviders = new ListProviderService_1.default(fakeUsersRepository, fakeCacheProvider);
    });
    it('should be able to list the providers', async () => {
        const user1 = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });
        const user2 = await fakeUsersRepository.create({
            name: 'John Trê',
            email: 'johntre@example.com',
            password: '123456',
        });
        const loggedUser = await fakeUsersRepository.create({
            name: 'John Qua',
            email: 'johnqua@example.com',
            password: '123456',
        });
        const providers = await listProviders.execute({
            user_id: loggedUser.id,
        });
        expect(providers).toEqual([user1, user2]);
    });
});
