import mongoose from 'mongoose';
import { IState } from '../interfaces/state.interface';
import { State } from '../models/state';
import { StateInput } from '../types/state';
import { Country } from '../models/country';

export const createState = async (
  name: string,
  countryId: mongoose.Types.ObjectId,
): Promise<IState> => {
  //Check if country exists
  const countryExists = await Country.findById(countryId);
  if (!countryExists) {
    throw new Error('Country not found');
  }

  // If Country Exist create state
  const state: StateInput = { name, countryId };
  const newstate = await State.create(state);

  return newstate;
};

export const deleteStateService = async (id: string): Promise<void> => {
  await State.findByIdAndDelete(id);
  return;
};
