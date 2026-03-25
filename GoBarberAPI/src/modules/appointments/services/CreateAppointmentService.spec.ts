import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeUsersRepository: FakeUsersRepository;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeUsersRepository = new FakeUsersRepository();
    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeUsersRepository,
    );
  });

  it('should be able to create a new appointment', async () => {
    const provider = await fakeUsersRepository.create({
      name: 'Jane Provider',
      email: 'provider@example.com',
      password: '123456',
    });

    const user = await fakeUsersRepository.create({
      name: 'John User',
      email: 'user@example.com',
      password: '123456',
    });

    const appointment = await createAppointment.execute({
      date: new Date(2099, 4, 10, 10),
      provider_id: provider.id,
      user_id: user.id,
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe(provider.id);
    expect(appointment.user_id).toBe(user.id);
  });

  it('should not be able to create two appointments on the same time', async () => {
    const provider = await fakeUsersRepository.create({
      name: 'Jane Provider',
      email: 'provider2@example.com',
      password: '123456',
    });

    const user = await fakeUsersRepository.create({
      name: 'John User',
      email: 'user2@example.com',
      password: '123456',
    });

    const appointmentDate = new Date(2099, 4, 10, 10);

    await createAppointment.execute({
      date: appointmentDate,
      provider_id: provider.id,
      user_id: user.id,
    });

    await expect(
      createAppointment.execute({
        date: appointmentDate,
        provider_id: provider.id,
        user_id: user.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
