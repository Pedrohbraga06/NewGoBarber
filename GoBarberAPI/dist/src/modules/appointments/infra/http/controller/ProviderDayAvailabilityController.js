"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const ListProviderDayAvailabilityService_1 = __importDefault(require("@modules/appointments/services/ListProviderDayAvailabilityService"));
class ProviderDayAvailabilityController {
    async index(request, response) {
        const { provider_id } = request.params;
        const { day, month, year } = request.query;
        const listProviderDayAvailability = tsyringe_1.container.resolve(ListProviderDayAvailabilityService_1.default);
        const availability = await listProviderDayAvailability.execute({
            provider_id,
            day: Number(day),
            month: Number(month),
            year: Number(year),
        });
        return response.json(availability);
    }
}
exports.default = ProviderDayAvailabilityController;
