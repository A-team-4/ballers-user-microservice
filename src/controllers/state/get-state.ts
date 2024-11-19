import { Request, Response } from 'express';
import { STATE_NOT_FOUND, SUCCESS_MESSAGE } from '../../constants/contants';

import { apiErrorHandler } from '../../utils/api-error-handler';
import { getStateByIdService } from '../../services/state-service';
import validator from 'validator';

export const getStateByIdController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const state = await getStateByIdService(validator.escape(id));
    if (!state) {
      res.status(404).json({ message: STATE_NOT_FOUND });
      return;
    }
    res.status(200).json({ message: SUCCESS_MESSAGE, data: state });
    return;
  } catch (e: unknown) {
    apiErrorHandler(e, res);
    return;
  }
};
