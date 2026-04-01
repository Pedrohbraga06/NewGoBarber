import { injectable, inject } from 'tsyringe';
import { isAfter } from 'date-fns';
import AppError from '@shared/errors/AppError';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  appointment_id: string;
  confirmation_code: string;
}

@injectable()
class ConfirmAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({ appointment_id, confirmation_code }: IRequest): Promise<void> {
    const appointment = await this.appointmentsRepository.findById(appointment_id);

    if (!appointment) {
      throw new AppError('Appointment not found.', 404);
    }

    if (appointment.confirmed) {
      throw new AppError('Appointment already confirmed.', 400);
    }

    if (appointment.confirmation_code !== confirmation_code) {
      throw new AppError('Invalid confirmation code.', 400);
    }

    if (isAfter(new Date(), appointment.expires_at)) {
      throw new AppError('Confirmation code has expired.', 400);
    }

    appointment.confirmed = true;
    appointment.status = 'confirmed';
    await this.appointmentsRepository.save(appointment);
  }
}

export default ConfirmAppointmentService;