import { Request, Response } from 'express';
import { apiErrorHandler } from '../../utils/api-error-handler';
import validator from 'validator';
import { SUCCESS_MESSAGE, ID_NOT_FOUND } from '../../constants/contants';
import { getRoleByIdService } from '../../services/role-service';

export const getRoleByIdController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const id = req.params.id;

  try {
    const validatedId = validator.escape(id.trim());
    const role = await getRoleByIdService(validatedId);

    if (!role) {
      res.status(404).json({ message: ID_NOT_FOUND, status: false });
      return;
    }

    res
      .status(200)
      .json({ message: SUCCESS_MESSAGE, data: role, status: true });
    return;
  } catch (e: unknown) {
    apiErrorHandler(e, res);
    return;
  }
};
