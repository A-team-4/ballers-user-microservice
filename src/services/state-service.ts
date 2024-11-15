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

export const getStateByIdService = async (
  id: string,
): Promise<IState | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid ID format');
  }
  const state = await State.findById(id).exec();
  return state;
};

export const getStateByCountryIdService = async (
  countryId: string,
): Promise<IState[] | null> => {
  if (!mongoose.Types.ObjectId.isValid(countryId)) {
    throw new Error('Invalid Country ID format');
  }
  const states = await State.find({ countryId }).exec();
  return states;
};

export const deleteStateService = async (id: string): Promise<void> => {
  await State.findByIdAndDelete(id);
  return;
};

export const updateStateService = async (
  id: string,
  stateInput: Partial<IState>,
): Promise<IState | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid ID format');
  }
  const updatedState = await State.findByIdAndUpdate(id, stateInput, {
    new: true,
    runValidators: true,
  });
  return updatedState;
};
