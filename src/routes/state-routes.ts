import { Router } from 'express';
import { getStateByIdController } from '../controllers/state/get-state';

const stateRoute = (): Router => {
  const router = Router();
  router.get('/state/:id', getStateByIdController);
  return router;
};

export { stateRoute };
