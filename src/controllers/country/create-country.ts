import { Request, Response } from 'express';
import {
  COUNTRY_CREATED_MESSAGE,
  NAME_REQUIRED,
} from '../../constants/contants';

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

  res.status(200).json({ message: COUNTRY_CREATED_MESSAGE });
  return;
};
