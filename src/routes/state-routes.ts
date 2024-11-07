import { Router } from 'express';
import { createStateController } from '../controllers/state/create-state';
import { deleteStateController } from '../controllers/state/delete-state';

const stateRoute = (): Router => {
  const router = Router();

  router.post('/state', createStateController);
  router.delete('/state/:id', deleteStateController);

  return router;
};

export { stateRoute };
