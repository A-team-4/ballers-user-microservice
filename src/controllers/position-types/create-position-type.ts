import { Request, Response } from 'express';
import { NAME_REQUIRED, POSITION_TYPE_CREATED } from '../../constants/contants';
import { apiErrorHandler } from '../../utils/api-error-handler';
import { createPositionTypeService } from '../../services/position-type-service';

export const createPositionTypeController = async (
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
    await createPositionTypeService(name);
    res.status(201).json({ message: POSITION_TYPE_CREATED, status: true });
    return;
  } catch (e: unknown) {
    apiErrorHandler(e, res);
    return;
  }
};
