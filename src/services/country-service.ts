import { ICountry } from '../interfaces/country.interface';
import { Country } from '../models/country';
import { CountryInput } from '../types/country';

export const createCountryService = async (name: string): Promise<ICountry> => {
  const countryInput: CountryInput = { name };

  const countryCreated = Country.create(countryInput);

  return countryCreated;
};
