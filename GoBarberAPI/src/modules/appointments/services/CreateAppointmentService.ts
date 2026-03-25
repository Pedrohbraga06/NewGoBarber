import { startOfHour, isBefore, getHours } from 'date-fns';
import Appointment from '../infra/typeorm/entities/Appointment';
import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

interface IRequest {
  provider_id: string;
  user_id: string;
  date: Date;
}

@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ date, provider_id, user_id }: IRequest): Promise<Appointment> {
    // Validar entrada
    if (!provider_id || !user_id || !date) {
      throw new AppError('Provider ID, User ID, and date are required.', 400);
    }

    // Não permitir mesmo usuário ser provider e cliente
    if (provider_id === user_id) {
      throw new AppError('You cannot book an appointment with yourself.', 400);
    }

    const appointmentDate = startOfHour(date);

    // Verificar se é data no passado
    if (isBefore(appointmentDate, new Date())) {
      throw new AppError('You cannot book an appointment in the past.', 400);
    }

    // Verificar horário comercial (8h - 17h)
    const appointmentHour = getHours(appointmentDate);
    if (appointmentHour < 8 || appointmentHour >= 17) {
      throw new AppError('Appointments can only be booked between 8 AM and 5 PM.', 400);
    }

    // Verificar se provider existe
    const provider = await this.usersRepository.findById(provider_id);
    if (!provider) {
      throw new AppError('Provider not found.', 404);
    }

    // Verificar se o horário já está ocupado
    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate,
      provider_id,
    );

    if (findAppointmentInSameDate) {
      throw new AppError('This appointment time is already booked.', 409);
    }

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      user_id,
      date: appointmentDate,
    });

    return appointment;
  }
}

export default CreateAppointmentService;