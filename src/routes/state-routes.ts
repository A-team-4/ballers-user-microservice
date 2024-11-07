import { Router } from 'express';
import { getStateByIdController } from '../controllers/state/get-state';
import { createStateController } from '../controllers/state/create-state';
import { deleteStateController } from '../controllers/state/delete-state';
import { updateStateController } from '../controllers/state/update-state';

const stateRoute = (): Router => {
  const router = Router();
  router.post('/state', createStateController);
  router.delete('/state/:id', deleteStateController);
  router.get('/state/:id', getStateByIdController);
  router.put('/state/:id', updateStateController);
  return router;
};

export { stateRoute };
