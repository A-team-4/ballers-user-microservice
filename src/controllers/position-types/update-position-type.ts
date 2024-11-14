import { Request, Response } from 'express';
import {
  ID_NOT_FOUND,
  NAME_REQUIRED,
  SUCCESS_MESSAGE,
} from '../../constants/contants';
import { apiErrorHandler } from '../../utils/api-error-handler';
import validator from 'validator';
import { updatePositionTypeService } from '../../services/position-type-service';

export const updatePositionTypesController = async (
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
    const sanitiziedName = validator.escape(name.trim());
    const updatedPositionType = await updatePositionTypeService(
      validatedId,
      sanitiziedName,
    );
    if (!updatedPositionType) {
      res.status(404).json({ message: ID_NOT_FOUND });
      return;
    }
    res.status(200).json({
      message: SUCCESS_MESSAGE,
      data: updatedPositionType,
      status: true,
    });
    return;
  } catch (error: unknown) {
    apiErrorHandler(error, res);
    return;
  }
};
