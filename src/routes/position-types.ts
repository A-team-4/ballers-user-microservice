import { Router } from 'express';
import { createPositionTypeController } from '../controllers/position-types/create-position-type';
import { deletePositionTypeController } from '../controllers/position-types/delete-position-type';
import { getPositionTypeByIdController } from '../controllers/position-types/get-position-type-by-id';
import { getAllPositionTypesController } from '../controllers/position-types/get-position-type';
import { updatePositionTypesController } from '../controllers/position-types/update-position-type';

const positionTypeRoute = (): Router => {
  const router = Router();

  router.post('/position-type', createPositionTypeController);
  router.delete('/position-type/:id', deletePositionTypeController);
  router.get('/position-type/:id', getPositionTypeByIdController);
  router.get('/position-type', getAllPositionTypesController);
  router.put('/position-type/:id', updatePositionTypesController);

  return router;
};

export { positionTypeRoute };
