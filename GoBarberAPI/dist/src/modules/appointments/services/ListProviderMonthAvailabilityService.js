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
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const date_fns_1 = require("date-fns");
let ListProviderMonthAvailabilityService = class ListProviderMonthAvailabilityService {
    constructor(appointmentsRepository) {
        this.appointmentsRepository = appointmentsRepository;
    }
    async execute({ provider_id, year, month, }) {
        const appointments = await this.appointmentsRepository.findAllInMonthFromProvider({
            provider_id,
            year,
            month,
        });
        const numberOfDaysInMonth = (0, date_fns_1.getDaysInMonth)(new Date(year, month - 1));
        const eachDayArray = Array.from({ length: numberOfDaysInMonth }, (_, index) => index + 1);
        const availability = eachDayArray.map(day => {
            const compareDate = new Date(year, month - 1, day, 23, 59, 59);
            const appointmentsInDay = appointments.filter(appointment => {
                return (0, date_fns_1.getDate)(appointment.date) === day;
            });
            return {
                day,
                available: (0, date_fns_1.isAfter)(compareDate, new Date()) && appointmentsInDay.length < 10,
            };
        });
        return availability;
    }
};
ListProviderMonthAvailabilityService = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)('AppointmentsRepository')),
    __metadata("design:paramtypes", [Object])
], ListProviderMonthAvailabilityService);
exports.default = ListProviderMonthAvailabilityService;
