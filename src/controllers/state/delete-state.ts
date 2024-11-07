import { Request, Response } from 'express';
import { SUCCESS_MESSAGE } from '../../constants/contants';
import { apiErrorHandler } from '../../utils/api-error-handler';
import validator from 'validator';
import { deleteStateService } from '../../services/state-service';

export const deleteStateController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const id = req.params.id;
  console.log('This is Id ' + id);

  try {
    const validatedId = validator.escape(id.trim());
    console.log('Ballers innit');
    await deleteStateService(validatedId);
    res.status(200).json({ message: SUCCESS_MESSAGE });
    return;
  } catch (e: unknown) {
    console.log('error', e);
    apiErrorHandler(e, res);
    return;
  }
};
