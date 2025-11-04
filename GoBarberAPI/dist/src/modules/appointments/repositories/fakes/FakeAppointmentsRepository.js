"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const date_fns_1 = require("date-fns");
const Appointment_1 = __importDefault(require("@modules/appointments/infra/typeorm/entities/Appointment"));
class FakeAppointmentsRepository {
    constructor() {
        this.appointments = [];
    }
    async findByDate(date) {
        const findAppointment = this.appointments.find(appointment => (0, date_fns_1.isEqual)(appointment.date, date));
        return findAppointment;
    }
    async findAllInMonthFromProvider({ provider_id, month, year, }) {
        const appointments = this.appointments.filter(appointment => appointment.provider_id === provider_id &&
            (0, date_fns_1.getMonth)(appointment.date) + 1 === month &&
            (0, date_fns_1.getYear)(appointment.date) === year);
        return appointments;
    }
    async findAllInDayFromProvider({ provider_id, day, month, year, }) {
        const appointments = this.appointments.filter(appointment => appointment.provider_id === provider_id &&
            (0, date_fns_1.getDate)(appointment.date) === day &&
            (0, date_fns_1.getMonth)(appointment.date) + 1 === month &&
            (0, date_fns_1.getYear)(appointment.date) === year);
        return appointments;
    }
    async create({ provider_id, user_id, date, }) {
        const appointment = new Appointment_1.default();
        Object.assign(appointment, { id: (0, uuid_1.v4)(), date, provider_id, user_id });
        this.appointments.push(appointment);
        return appointment;
    }
}
exports.default = FakeAppointmentsRepository;
