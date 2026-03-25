"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const Appointment_1 = __importDefault(require("../entities/Appointment"));
class AppointmentsRepository {
    constructor() {
        this.ormRepository = (0, typeorm_1.getRepository)(Appointment_1.default);
    }
    async findByDate(date, provider_id) {
        const findAppointment = await this.ormRepository.findOne({
            where: { date, provider_id },
        });
        return findAppointment;
    }
    async findAllInMonthFromProvider({ provider_id, month, year, }) {
        const parsedMonth = String(month).padStart(2, '0');
        const appointments = await this.ormRepository.find({
            where: {
                provider_id,
                date: (0, typeorm_1.Raw)(dateFieldName => `to_char(${dateFieldName}, MM-YYYY) = '${parsedMonth}-${year}'`),
            },
        });
        return appointments;
    }
    async findAllInDayFromProvider({ provider_id, day, month, year, }) {
        const parsedDay = String(day).padStart(2, '0');
        const parsedMonth = String(month).padStart(2, '0');
        const appointments = await this.ormRepository.find({
            where: {
                provider_id,
                date: (0, typeorm_1.Raw)(dateFieldName => `to_char(${dateFieldName}, DD-MM-YYYY) = '${parsedDay}-${parsedMonth}-${year}'`),
            },
        });
        return appointments;
    }
    async create({ provider_id, user_id, date, }) {
        const appointment = this.ormRepository.create({
            provider_id,
            user_id,
            date,
        });
        await this.ormRepository.save(appointment);
        return appointment;
    }
}
exports.default = AppointmentsRepository;
