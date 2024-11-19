import { Request, Response } from 'express';
import { SUCCESS_MESSAGE, STATE_NOT_FOUND } from '../../constants/contants';
import { apiErrorHandler } from '../../utils/api-error-handler';
import { getStateByCountryIdService } from '../../services/state-service';
import validator from 'validator';

export const getStateByCountryIdController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const sanitizedCountryId = validator.escape(id);
    const states = await getStateByCountryIdService(sanitizedCountryId);

    if (!states || states.length === 0) {
      res.status(404).json({ message: STATE_NOT_FOUND });
      return;
    }

    res.status(200).json({ message: SUCCESS_MESSAGE, data: states });
    return;
  } catch (e: unknown) {
    apiErrorHandler(e, res);
    return;
  }
};
