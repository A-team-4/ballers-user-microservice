import { Router } from 'express';
import { createCountryController } from '../controllers/country/create-country';
import { getCountryByIdController } from '../controllers/country/get-country-by-id';
import { getAllCountryController } from '../controllers/country/get-country';
import { deleteCountryController } from '../controllers/country/delete-country';
import { updateCountryontroller } from '../controllers/country/update-country';

const countryRoute = (): Router => {
  const router = Router();

  router.post('/country', createCountryController);
  router.get('/country', getAllCountryController);
  router.get('/country/:id', getCountryByIdController);
  router.delete('/country/:id', deleteCountryController);
  router.put('/country/:id', updateCountryontroller);

  return router;
};

export { countryRoute };
