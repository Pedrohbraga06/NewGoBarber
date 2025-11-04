import { Router } from 'express';
import Profilecontroller from '../controllers/ProfileController';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const profileRouter = Router();
const profileController = new Profilecontroller();

profileRouter.use('/', ensureAuthenticated);

profileRouter.get('/', profileController.show);
profileRouter.put('/', profileController.update);

export default profileRouter;