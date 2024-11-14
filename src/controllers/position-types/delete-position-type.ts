import { Request, Response } from 'express';
import { ID_NOT_FOUND, SUCCESS_MESSAGE } from '../../constants/contants';
import { apiErrorHandler } from '../../utils/api-error-handler';
import validator from 'validator';
import { deletePositionTypeService } from '../../services/position-type-service';

export const deletePositionTypeController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const id = req.params.id;

  try {
    const validatedId = validator.escape(id.trim());
    const response = await deletePositionTypeService(validatedId);
    if (!response) {
      res.status(404).json({ message: ID_NOT_FOUND, status: false });
      return;
    }
    res.status(200).json({ message: SUCCESS_MESSAGE, status: true });
    return;
  } catch (e: unknown) {
    apiErrorHandler(e, res);
    return;
  }
};
