import { Router } from "express";
import AppointmentsController from "../controller/AppointmentsController";
import ConfirmAppointmentController from "../controller/ConfirmAppointmentController";
import ensureAuthenticade from "@modules/users/infra/http/middlewares/ensureAuthenticated";


const appointmentsRouter = Router();

const appointmentsController = new AppointmentsController();
const confirmAppointmentController = new ConfirmAppointmentController();

appointmentsRouter.use(ensureAuthenticade);

appointmentsRouter.post('/', appointmentsController.create);
appointmentsRouter.post('/:id/confirm', confirmAppointmentController.create);

export default appointmentsRouter;