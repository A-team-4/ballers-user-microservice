import mongoose from 'mongoose';
import { IState } from '../interfaces/state.interface';
import { State } from '../models/state';

export const getStateByIdService = async (
  id: string,
): Promise<IState | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid ID format');
  }
  const state = await State.findById(id).exec();
  return state;
};
