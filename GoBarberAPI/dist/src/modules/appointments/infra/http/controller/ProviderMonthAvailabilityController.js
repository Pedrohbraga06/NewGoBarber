"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const ListProviderMonthAvailabilityService_1 = __importDefault(require("@modules/appointments/services/ListProviderMonthAvailabilityService"));
class ProviderMonthAvailabilityController {
    async index(request, response) {
        const { provider_id } = request.params;
        const { month, year } = request.query;
        const listProviderMonthAvailability = tsyringe_1.container.resolve(ListProviderMonthAvailabilityService_1.default);
        const availability = await listProviderMonthAvailability.execute({
            provider_id,
            month: Number(month),
            year: Number(year),
        });
        return response.json(availability);
    }
}
exports.default = ProviderMonthAvailabilityController;
