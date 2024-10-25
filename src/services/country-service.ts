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

export const deleteCountryService = async (id: string): Promise<void> => {
  await Country.findByIdAndDelete(id);
  return;
};
