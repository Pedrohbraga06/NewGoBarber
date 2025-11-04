"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = __importDefault(require("@shared/errors/AppError"));
const FakeAppointmentsRepository_1 = __importDefault(require("../repositories/fakes/FakeAppointmentsRepository"));
const CreateAppointmentService_1 = __importDefault(require("./CreateAppointmentService"));
let fakeAppointmentsRepository;
let CreateAppointment;
describe('CreateAppointment', () => {
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository_1.default();
        CreateAppointment = new CreateAppointmentService_1.default(fakeAppointmentsRepository);
    });
    it('should be able to create a new appointment', async () => {
        const fakeAppointmentsRepository = new FakeAppointmentsRepository_1.default();
        const CreateAppointment = new CreateAppointmentService_1.default(fakeAppointmentsRepository);
        const appointment = await CreateAppointment.execute({
            date: new Date(),
            provider_id: '123123',
        });
        expect(appointment).toHaveProperty('id');
        expect(appointment.provider_id).toBe('123123');
    });
    it('should not be able to create two appointments on the same time', async () => {
        const appointmentDate = new Date();
        await CreateAppointment.execute({
            date: appointmentDate,
            provider_id: '123123',
        });
        expect(CreateAppointment.execute({
            date: appointmentDate,
            provider_id: '123123',
        })).rejects.toBeInstanceOf(AppError_1.default);
    });
});
