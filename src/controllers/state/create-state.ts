import { Request, Response } from 'express';
import {
  COUNTRY_NOT_FOUND,
  INVALID_ID,
  NAME_REQUIRED,
  STATE_CREATED_MESSAGE,
} from '../../constants/contants';
import { createState } from '../../services/state-service';
import { apiErrorHandler } from '../../utils/api-error-handler';
import mongoose from 'mongoose';

export const createStateController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { name, countryId } = req.body;

  if (!name) {
    res.status(422).json({
      message: NAME_REQUIRED,
    });
    return;
  }

  // Validate that countryId is a valid ObjectIdj
  if (!countryId || !mongoose.Types.ObjectId.isValid(countryId)) {
    res.status(400).json({ message: INVALID_ID });
    return;
  }

  try {
    await createState(name, countryId);
    res.status(201).json({ message: STATE_CREATED_MESSAGE });
    return;
  } catch (e: unknown) {
    if (e instanceof Error && e.message === 'Country not found') {
      res.status(404).json({ message: COUNTRY_NOT_FOUND });
      return;
    }
    apiErrorHandler(e, res);
    return;
  }
};
