import AppError from "@shared/errors/AppError";
import FakeAppointmentsRepository from "../repositories/fakes/FakeAppointmentsRepository";
import CreateAppointmentService from "./CreateAppointmentService";

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let CreateAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        CreateAppointment = new CreateAppointmentService(fakeAppointmentsRepository,
        );
    });

    it('should be able to create a new appointment', async () => {
        const fakeAppointmentsRepository = new FakeAppointmentsRepository();
        const CreateAppointment = new CreateAppointmentService(fakeAppointmentsRepository,
        );

      const appointment = await CreateAppointment.execute({
            date: new Date(),
            provider_id:'123123',
        });

        expect(appointment).toHaveProperty('id');
        expect(appointment.provider_id).toBe('123123');
    });

    it('should not be able to create two appointments on the same time', async () => {

        const appointmentDate = new Date();

      await CreateAppointment.execute({
            date:appointmentDate,
            provider_id:'123123',
        });

        expect(CreateAppointment.execute({
            date:appointmentDate,
            provider_id:'123123',
        })).rejects.toBeInstanceOf(AppError);
    });
}); 