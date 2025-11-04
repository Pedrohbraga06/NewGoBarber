"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const FakeAppointmentsRepository_1 = __importDefault(require("../repositories/fakes/FakeAppointmentsRepository"));
const ListProviderDayAvailabilityService_1 = __importDefault(require("./ListProviderDayAvailabilityService"));
let fakeAppointmentsRepository;
let listProviderDayAvailability;
describe('ListProviderMonthAvailability', () => {
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository_1.default();
        listProviderDayAvailability = new ListProviderDayAvailabilityService_1.default(fakeAppointmentsRepository);
    });
    it('should be able to list the day availability from provider', async () => {
        await fakeAppointmentsRepository.create({
            provider_id: 'user',
            user_id: 'user',
            date: new Date(2022, 4, 20, 14, 0, 0),
        });
        await fakeAppointmentsRepository.create({
            provider_id: 'user',
            user_id: 'user',
            date: new Date(2022, 4, 20, 15, 0, 0),
        });
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2022, 4, 20, 11).getTime();
        });
        const availability = await listProviderDayAvailability.execute({
            provider_id: 'user',
            year: 2022,
            month: 5,
            day: 20,
        });
        expect(availability).toEqual(expect.arrayContaining([
            { hour: 8, available: false },
            { hour: 9, available: false },
            { hour: 10, available: false },
            { hour: 13, available: true },
            { hour: 14, available: false },
            { hour: 15, available: false },
            { hour: 16, available: true },
        ]));
    });
});
