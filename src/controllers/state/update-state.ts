import { Request, Response } from 'express';
import {
  INVALID_COUNTRY_ID,
  INVALID_STATE_ID,
  NAME_REQUIRED,
  STATE_NOT_FOUND,
  SUCCESS_MESSAGE,
} from '../../constants/contants';
import { apiErrorHandler } from '../../utils/api-error-handler';
import validator from 'validator';
import mongoose from 'mongoose';
import { IState } from '../../interfaces/state.interface';
import { updateStateService } from '../../services/state-service';

export const updateStateController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id } = req.params;
  const { name, countryId } = req.body;

  if (!name) {
    res.status(400).json({ message: NAME_REQUIRED });
    return;
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: INVALID_STATE_ID });
    return;
  }

  if (!mongoose.Types.ObjectId.isValid(countryId)) {
    res.status(400).json({ message: INVALID_COUNTRY_ID });
    return;
  }

  try {
    const validatedId = validator.escape(id.trim());
    const stateTobeUpdated: Partial<IState> = {
      name: validator.escape(name.trim()),
      countryId,
    };
    const updatedState = await updateStateService(
      validatedId,
      stateTobeUpdated,
    );
    if (!updatedState) {
      res.status(404).json({ message: STATE_NOT_FOUND });
      return;
    }
    res.status(200).json({ message: SUCCESS_MESSAGE, data: updatedState });
    return;
  } catch (error: unknown) {
    apiErrorHandler(error, res);
    return;
  }
};
