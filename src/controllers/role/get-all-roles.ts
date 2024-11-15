import { Request, Response } from 'express';
import { SUCCESS_MESSAGE } from '../../constants/contants';
import { apiErrorHandler } from '../../utils/api-error-handler';
import { getAllRolesService } from '../../services/role-service';

export const getAllRolesController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const roles = await getAllRolesService();
    res
      .status(200)
      .json({ message: SUCCESS_MESSAGE, data: roles, status: true });
    return;
  } catch (e: unknown) {
    apiErrorHandler(e, res);
    return;
  }
};
