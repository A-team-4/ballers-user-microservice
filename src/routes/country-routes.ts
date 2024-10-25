import { Router } from 'express';
import { createCountryController } from '../controllers/country/create-country';
import { getAllCountryController } from '../controllers/country/get-country';
import { deleteCountryController } from '../controllers/country/delete-country';

const countryRoute = (): Router => {
  const router = Router();

  router.post('/country', createCountryController);
  router.get('/country', getAllCountryController);
  router.delete('/country/:id', deleteCountryController);

  return router;
};

export { countryRoute };
