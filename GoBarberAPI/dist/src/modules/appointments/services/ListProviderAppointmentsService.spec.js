"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const FakeCacheProvider_1 = __importDefault(require("@shared/container/providers/CacheProvider/fakes/FakeCacheProvider"));
const FakeAppointmentsRepository_1 = __importDefault(require("../repositories/fakes/FakeAppointmentsRepository"));
const ListProviderAppointmentsService_1 = __importDefault(require("./ListProviderAppointmentsService"));
let fakeAppointmentsRepository;
let fakeCacheProvider;
let listProviderAppointments;
describe('ListProviderAppointments', () => {
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository_1.default();
        fakeCacheProvider = new FakeCacheProvider_1.default();
        listProviderAppointments = new ListProviderAppointmentsService_1.default(fakeAppointmentsRepository, fakeCacheProvider);
    });
    it('should be able to list the appointments on a specific day', async () => {
        const appointment1 = await fakeAppointmentsRepository.create({
            provider_id: 'provider',
            user_id: 'user',
            date: new Date(2022, 4, 20, 14, 0, 0),
        });
        const appointment2 = await fakeAppointmentsRepository.create({
            provider_id: 'provider',
            user_id: 'user',
            date: new Date(2022, 4, 20, 15, 0, 0),
        });
        const appointments = await listProviderAppointments.execute({
            provider_id: 'provider',
            year: 2022,
            month: 5,
            day: 20,
        });
        expect(appointments).toEqual([appointment1, appointment2]);
    });
});
