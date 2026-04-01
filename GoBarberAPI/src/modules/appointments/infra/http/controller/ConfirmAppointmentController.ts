import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ConfirmAppointmentService from '@modules/appointments/services/ConfirmAppointmentService';

export default class ConfirmAppointmentController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { confirmation_code } = request.body;
    const user_id = request.user.id;

    const confirmAppointment = container.resolve(ConfirmAppointmentService);

    await confirmAppointment.execute({
      appointment_id: id,
      confirmation_code,
    });

    return response.status(204).send();
  }
}