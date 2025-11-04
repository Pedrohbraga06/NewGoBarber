import AppError from "@shared/errors/AppError";
import FakeUsersRepository from "../repositories/fakes/fakeUsersRepository";
import FakeHashProvider from "../providers/HashProvider/fakes/FakeHashProvider";
import CreateUserService from "./CreateUserService";

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let CreateUser: CreateUserService;

describe('CreateUser', () => {

    beforeEach(() => {

        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();
        CreateUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
    });

    it('should be able to create a new user', async () => {
        const user = await CreateUser.execute({
            name: 'john Doe',
            email: 'johndoe@example.com',
            password:'123456',
        });

        expect(user).toHaveProperty('id');
    });

    it('should not be able to create a new user with same email from another', async () => {
        await CreateUser.execute({
            name: 'john Doe',
            email: 'johndoe@example.com',
            password:'123456',
        });

      await expect(
            CreateUser.execute({
                name: 'john Doe',
                email: 'johndoe@example.com',
                password:'123456',
            }),
        ).rejects.toBeInstanceOf(AppError)
    });
});
