import { Request, Response } from 'express';
import {
  ID_NOT_FOUND,
  TYPE_REQUIRED,
  SUCCESS_MESSAGE,
} from '../../constants/contants';
import { apiErrorHandler } from '../../utils/api-error-handler';
import validator from 'validator';
import { updateRoleService } from '../../services/role-service';

export const updateRoleController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id } = req.params;
  const { type } = req.body;

  if (!type) {
    res.status(400).json({ message: TYPE_REQUIRED });
    return;
  }

  try {
    const validatedId = validator.escape(id.trim());
    const sanitiziedType = validator.escape(type.trim());
    const updatedRole = await updateRoleService(validatedId, sanitiziedType);
    if (!updatedRole) {
      res.status(404).json({ message: ID_NOT_FOUND });
      return;
    }
    res.status(200).json({
      message: SUCCESS_MESSAGE,
      data: updatedRole,
      status: true,
    });
    return;
  } catch (error: unknown) {
    apiErrorHandler(error, res);
    return;
  }
};
