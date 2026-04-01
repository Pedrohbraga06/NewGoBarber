import { startOfHour, isBefore, getHours, addMinutes } from 'date-fns';
import { v4 as uuid } from 'uuid';
import Appointment from '../infra/typeorm/entities/Appointment';
import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';

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

    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,
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

    // Anti-bot: Limite de agendamentos por usuário (máximo 3 por dia)
    const appointmentsCount = await this.appointmentsRepository.countAppointmentsByUserInDay(user_id, appointmentDate);
    if (appointmentsCount >= 3) {
      throw new AppError('You have reached the maximum number of appointments per day.', 429);
    }

    // Verificar se o horário já está ocupado
    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate,
      provider_id,
    );

    if (findAppointmentInSameDate) {
      throw new AppError('This appointment time is already booked.', 409);
    }

    // Gerar código de confirmação
    const confirmationCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6 dígitos

    // Definir expiração (15 minutos)
    const expiresAt = addMinutes(new Date(), 15);

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      user_id,
      date: appointmentDate,
    });

    // Atualizar com código e expiração
    appointment.confirmation_code = confirmationCode;
    appointment.expires_at = expiresAt;
    appointment.status = 'pending';
    await this.appointmentsRepository.save(appointment);

    // Enviar notificação com código
    await this.notificationsRepository.create({
      recipient_id: user_id,
      content: `Seu agendamento foi criado. Código de confirmação: ${confirmationCode}. Expira em 15 minutos.`,
    });

    return appointment;
  }
}

export default CreateAppointmentService;