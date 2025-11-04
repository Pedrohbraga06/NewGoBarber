import Appointment from '../infra/typeorm/entities/Appointment';
import ICreateAppointmentDTO from '../dtos/ICreateAppointmentDTO';

import IFindAllInDayFromProviderDTO from '../dtos/IFindAllInDayFromProviderDTO';
import IFindAllInMonthFromProviderDTO from './fakes/IFindAllInMonthFromProviderDTO';

export default interface IAppointmentsRepository {
  create(data: ICreateAppointmentDTO): Promise<Appointment>;
  findByDate(data: Date): Promise<Appointment | undefined>;
  findAllInMonthFromProvider(
    data: IFindAllInMonthFromProviderDTO,
  ): Promise<Appointment[]>;
  findAllInDayFromProvider(
    data: IFindAllInDayFromProviderDTO,
  ): Promise<Appointment[]>;
}