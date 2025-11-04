"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
// import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';
// import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';
const User_1 = __importDefault(require("../entities/User"));
class UsersRepository {
    constructor() {
        this.ormRepository = (0, typeorm_1.getRepository)(User_1.default);
    }
    findAllProviders(data) {
        throw new Error('Method not implemented.');
    }
    async findById(id) {
        const user = await this.ormRepository.findOne(id);
        return user;
    }
    async findByEmail(email) {
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
    async create(userData) {
        const appointment = this.ormRepository.create(userData);
        await this.ormRepository.save(appointment);
        return appointment;
    }
    async save(user) {
        return this.ormRepository.save(user);
    }
}
exports.default = UsersRepository;
