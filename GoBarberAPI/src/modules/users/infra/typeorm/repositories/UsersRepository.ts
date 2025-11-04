import { getRepository, Repository, Raw } from 'typeorm';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';

// import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';
// import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';
import User from '../entities/User';
import IFindAllProvidersDTO from '@modules/users/dtos/IFindAllProvidersDTO';


class UsersRepository implements IUsersRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }
  findAllProviders(data: IFindAllProvidersDTO): Promise<User[]> {
    throw new Error('Method not implemented.');
  }

  public async findById(id: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne(id);

    return user;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({
      where: { email }
    });

    return user;
  }

  // public async findAllInMonthFromProvider({
  //   provider_id,
  //   month,
  //   year,
  // }: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
  //   const parsedMonth = String(month).padStart(2, '0');

  //   const appointments = await this.ormRepository.find({
  //     where: {
  //       provider_id,
  //       date: Raw(
  //         dateFieldName =>
  //           `to_char(${dateFieldName}, MM-YYYY) = '${parsedMonth}-${year}'`,
  //       ),
  //     },
  //   });

  //   return appointments;
  // }

  // public async findAllInDayFromProvider({
  //   provider_id,
  //   day,
  //   month,
  //   year,
  // }: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
  //   const parsedDay = String(day).padStart(2, '0');
  //   const parsedMonth = String(month).padStart(2, '0');

  //   const appointments = await this.ormRepository.find({
  //     where: {
  //       provider_id,
  //       date: Raw(
  //         dateFieldName =>
  //           `to_char(${dateFieldName}, DD-MM-YYYY) = '${parsedDay}-${parsedMonth}-${year}'`,
  //       ),
  //     },
  //   });

  //   return appointments;
  // }

  public async create(userData: ICreateUserDTO): Promise<User> {
    const appointment = this.ormRepository.create(userData);

    await this.ormRepository.save(appointment);

    return appointment;
  }

  public async save(user: User): Promise<User> {
    return this.ormRepository.save(user);
  }
}

export default UsersRepository;