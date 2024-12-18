import mongoose from 'mongoose';
import { ICountry } from '../interfaces/country.interface';
import { Country } from '../models/country';
import { CountryInput } from '../types/country';

export const createCountryService = async (name: string): Promise<ICountry> => {
  const countryInput: CountryInput = { name };
  const countryCreated = await Country.create(countryInput);
  return countryCreated;
};

export const getAllCountryService = async (): Promise<ICountry[]> => {
  const countries = await Country.find();
  return countries;
};

export const getCountryByIdService = async (
  id: string,
): Promise<ICountry | null> => {
  const country = await Country.findById(id);
  return country;
};

export const deleteCountryService = async (id: string): Promise<void> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid ID format');
  }
  await Country.findByIdAndDelete(id);
  return;
};

export const updateCountryService = async (
  id: string,
  newName: string,
): Promise<ICountry | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid ID format');
  }
  const updatedCountry = await Country.findByIdAndUpdate(
    id,
    { name: newName },
    { new: true, runValidators: true },
  );
  return updatedCountry;
};
