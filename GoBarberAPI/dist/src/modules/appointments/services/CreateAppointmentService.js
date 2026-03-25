"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const date_fns_1 = require("date-fns");
const tsyringe_1 = require("tsyringe");
const AppError_1 = __importDefault(require("@shared/errors/AppError"));
let CreateAppointmentService = class CreateAppointmentService {
    constructor(appointmentsRepository, usersRepository) {
        this.appointmentsRepository = appointmentsRepository;
        this.usersRepository = usersRepository;
    }
    async execute({ date, provider_id, user_id }) {
        // Validar entrada
        if (!provider_id || !user_id || !date) {
            throw new AppError_1.default('Provider ID, User ID, and date are required.', 400);
        }
        // Não permitir mesmo usuário ser provider e cliente
        if (provider_id === user_id) {
            throw new AppError_1.default('You cannot book an appointment with yourself.', 400);
        }
        const appointmentDate = (0, date_fns_1.startOfHour)(date);
        // Verificar se é data no passado
        if ((0, date_fns_1.isBefore)(appointmentDate, new Date())) {
            throw new AppError_1.default('You cannot book an appointment in the past.', 400);
        }
        // Verificar horário comercial (8h - 17h)
        const appointmentHour = (0, date_fns_1.getHours)(appointmentDate);
        if (appointmentHour < 8 || appointmentHour >= 17) {
            throw new AppError_1.default('Appointments can only be booked between 8 AM and 5 PM.', 400);
        }
        // Verificar se provider existe
        const provider = await this.usersRepository.findById(provider_id);
        if (!provider) {
            throw new AppError_1.default('Provider not found.', 404);
        }
        // Verificar se o horário já está ocupado
        const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(appointmentDate, provider_id);
        if (findAppointmentInSameDate) {
            throw new AppError_1.default('This appointment time is already booked.', 409);
        }
        const appointment = await this.appointmentsRepository.create({
            provider_id,
            user_id,
            date: appointmentDate,
        });
        return appointment;
    }
};
CreateAppointmentService = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)('AppointmentsRepository')),
    __param(1, (0, tsyringe_1.inject)('UsersRepository')),
    __metadata("design:paramtypes", [Object, Object])
], CreateAppointmentService);
exports.default = CreateAppointmentService;
