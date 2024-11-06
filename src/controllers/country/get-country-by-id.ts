import { Request, Response } from 'express';
import { getCountryByIdService } from '../../services/country-service';
import { apiErrorHandler } from '../../utils/api-error-handler';
import validator from 'validator';
import { SUCCESS_MESSAGE, COUNTRY_NOT_FOUND } from '../../constants/contants';

export const getCountryByIdController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const id = req.params.id;

  try {
    const validatedId = validator.escape(id.trim());
    const country = await getCountryByIdService(validatedId);

    if (!country) {
      res.status(404).json({ message: COUNTRY_NOT_FOUND });
      return;
    }

    res.status(200).json({ message: SUCCESS_MESSAGE, data: country });
    return;
  } catch (e: unknown) {
    apiErrorHandler(e, res);
    return;
  }
};
