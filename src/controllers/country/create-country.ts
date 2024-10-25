import { Request, Response } from 'express';
import {
  COUNTRY_CREATED_MESSAGE,
  NAME_REQUIRED,
} from '../../constants/contants';
import { createCountryService } from '../../services/country-service';
import { apiErrorHandler } from '../../utils/api-error-handler';

export const createCountryController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { name } = req.body;

  if (!name) {
    res.status(422).json({
      message: NAME_REQUIRED,
    });
    return;
  }

  try {
    await createCountryService(name);
    res.status(201).json({ message: COUNTRY_CREATED_MESSAGE });
    return;
  } catch (e: unknown) {
    apiErrorHandler(e, res);
    return;
  }
};
