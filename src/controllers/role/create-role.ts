import { Request, Response } from 'express';
import { ROLE_CREATED_MESSAGE, TYPE_REQUIRED } from '../../constants/contants';
import { apiErrorHandler } from '../../utils/api-error-handler';
import { createRoleService } from '../../services/role-service';

export const createRoleController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { type } = req.body;

  if (!type) {
    res.status(422).json({
      message: TYPE_REQUIRED,
    });
    return;
  }

  try {
    await createRoleService(type);
    res.status(201).json({ message: ROLE_CREATED_MESSAGE, status: true });
    return;
  } catch (e: unknown) {
    apiErrorHandler(e, res);
    return;
  }
};
