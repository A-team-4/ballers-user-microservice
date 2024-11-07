import mongoose from 'mongoose';
import { IState } from '../interfaces/state.interface';

export type StateInput = {
  name: IState['name'];
  countryId: mongoose.Types.ObjectId;
};
