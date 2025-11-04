import { Router } from "express";
import AppointmentsController from "../controller/AppointmentsController";
import ensureAuthenticade from "@modules/users/infra/http/middlewares/ensureAuthenticated";


const appointmentsRouter = Router();

const appointmentsController = new AppointmentsController();

appointmentsRouter.use(ensureAuthenticade);

appointmentsRouter.post('/', appointmentsController.create);

export default appointmentsRouter;