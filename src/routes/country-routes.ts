import { Router } from 'express';
import { createCountryController } from '../controllers/country/create-country';

const countryRoute = (): Router => {
  const router = Router();

  router.post('/country', createCountryController);

  return router;
};

export { countryRoute };
