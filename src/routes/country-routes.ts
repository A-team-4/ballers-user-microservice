import { Router } from 'express';
import { createCountryController } from '../controllers/country/create-country';
import { getAllCountryController } from '../controllers/country/get-country';

const countryRoute = (): Router => {
  const router = Router();

  router.post('/country', createCountryController);
  router.get('/country', getAllCountryController);

  return router;
};

export { countryRoute };
