import { Request, Response } from 'express';
import { SUCCESS_MESSAGE } from '../../constants/contants';
import { deleteCountryService } from '../../services/country-service';
import { apiErrorHandler } from '../../utils/api-error-handler';
import validator from 'validator';

export const deleteCountryController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const id = req.params.id;

  try {
    const validatedId = validator.escape(id.trim());
    await deleteCountryService(validatedId);
    res.status(200).json({ message: SUCCESS_MESSAGE });
    return;
  } catch (e: unknown) {
    apiErrorHandler(e, res);
    return;
  }
};
