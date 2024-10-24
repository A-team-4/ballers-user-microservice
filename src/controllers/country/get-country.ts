import { Request, Response } from 'express';
import { COUNTRY_RETRIEVED_SUCCESSFUL } from '../../constants/contants';
import { getAllCountryService } from '../../services/country-service';
import { apiErrorHandler } from '../../utils/api-error-handler';

export const getAllCountryController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const countries = await getAllCountryService();
    res
      .status(200)
      .json({ message: COUNTRY_RETRIEVED_SUCCESSFUL, data: countries });
    return;
  } catch (e: unknown) {
    apiErrorHandler(e, res);
    return;
  }
};
