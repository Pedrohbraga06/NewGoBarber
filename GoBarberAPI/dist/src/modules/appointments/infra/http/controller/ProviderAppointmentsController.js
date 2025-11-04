"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const ListProviderAppointmentsService_1 = __importDefault(require("@modules/appointments/services/ListProviderAppointmentsService"));
const class_transformer_1 = require("class-transformer");
class ProviderAppointmentsController {
    async index(request, response) {
        const provider_id = request.user.id;
        const { day, month, year } = request.query;
        const listProviderAppointments = tsyringe_1.container.resolve(ListProviderAppointmentsService_1.default);
        const appointments = await listProviderAppointments.execute({
            provider_id,
            day: Number(day),
            month: Number(month),
            year: Number(year),
        });
        return response.json((0, class_transformer_1.instanceToInstance)(appointments));
    }
}
exports.default = ProviderAppointmentsController;
