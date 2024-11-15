import { Router } from 'express';
import { createRoleController } from '../controllers/role/create-role';
import { deleteRoleController } from '../controllers/role/delete-role';
import { getRoleByIdController } from '../controllers/role/get-role-by-id';
import { getAllRolesController } from '../controllers/role/get-all-roles';
import { updateRoleController } from '../controllers/role/update-role';

const roleRoute = (): Router => {
  const router = Router();

  router.post('/role', createRoleController);
  router.delete('/role/:id', deleteRoleController);
  router.get('/role/:id', getRoleByIdController);
  router.get('/roles', getAllRolesController);
  router.put('/role/:id', updateRoleController);
  return router;
};

export { roleRoute };
