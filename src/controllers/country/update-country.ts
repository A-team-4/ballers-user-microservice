import { Request, Response } from 'express';
import {
  COUNTRY_NOT_FOUND,
  NAME_REQUIRED,
  SUCCESS_MESSAGE,
} from '../../constants/contants';
import { updateCountryService } from '../../services/country-service';
import { apiErrorHandler } from '../../utils/api-error-handler';
import validator from 'validator';

export const updateCountryontroller = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    res.status(400).json({ message: NAME_REQUIRED });
    return;
  }

  try {
    const validatedId = validator.escape(id.trim());
    const updatedCountry = await updateCountryService(validatedId, name);
    if (!updatedCountry) {
      res.status(404).json({ message: COUNTRY_NOT_FOUND });
      return;
    }
    res.status(200).json({ message: SUCCESS_MESSAGE, data: updatedCountry });
    return;
  } catch (error: unknown) {
    apiErrorHandler(error, res);
    return;
  }
};
