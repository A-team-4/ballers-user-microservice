import { Request, Response } from 'express';
import { SUCCESS_MESSAGE } from '../../constants/contants';
import { apiErrorHandler } from '../../utils/api-error-handler';
import { getAllPositionTypeService } from '../../services/position-type-service';

export const getAllPositionTypesController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const positionTypes = await getAllPositionTypeService();
    res
      .status(200)
      .json({ message: SUCCESS_MESSAGE, data: positionTypes, status: true });
    return;
  } catch (e: unknown) {
    apiErrorHandler(e, res);
    return;
  }
};
