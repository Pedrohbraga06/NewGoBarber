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
    constructor(appointmentsRepository) {
        this.appointmentsRepository = appointmentsRepository;
    }
    async execute({ date, provider_id }) {
        const appointmentDate = (0, date_fns_1.startOfHour)(date);
        const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(appointmentDate);
        if (findAppointmentInSameDate) {
            throw new AppError_1.default('This appointment is already booked');
        }
        const appointment = await this.appointmentsRepository.create({
            provider_id,
            date: appointmentDate,
            user_id: ""
        });
        return appointment;
    }
};
CreateAppointmentService = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)('AppointmentsRepository')),
    __metadata("design:paramtypes", [Object])
], CreateAppointmentService);
exports.default = CreateAppointmentService;
