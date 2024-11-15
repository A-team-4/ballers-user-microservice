import { Request, Response } from 'express';
import { ID_NOT_FOUND, SUCCESS_MESSAGE } from '../../constants/contants';
import { apiErrorHandler } from '../../utils/api-error-handler';
import validator from 'validator';
import { deleteRoleService } from '../../services/role-service';

export const deleteRoleController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const id = req.params.id;

  try {
    const validatedId = validator.escape(id.trim());
    const response = await deleteRoleService(validatedId);
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
