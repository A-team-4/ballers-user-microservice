/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createCountryService,
  getAllCountryService,
} from '../../services/country-service';
import { Country } from '../../models/country';

// Test create country service
describe('create-country.ts', () => {
  const body = { name: 'Nigeria' };
  const expectedResult = { name: 'Nigeria', _id: 'aabbs', __v: 0 };

  describe('createCountryService', () => {
    it('should return created Country', async () => {
      jest
        .spyOn(Country, 'create')
        .mockResolvedValueOnce(expectedResult as any);

      expect(await createCountryService(body.name)).toStrictEqual(
        expectedResult,
      );
    });
  });
});

// Test get all country service

jest.mock('../../models/country');

describe('getAllCountriesService', () => {
  it('should return all countries', async () => {
    const mockCountries = [{ name: 'Nigeria' }, { name: 'Ghana' }];

    // mock the find country method to return mock countries
    (Country.find as jest.Mock).mockResolvedValue(mockCountries);

    // Call the service
    const result = await getAllCountryService();

    // Assert: Check if the service returns the correct data
    expect(result).toEqual(mockCountries);
    expect(Country.find).toHaveBeenCalledTimes(1);
  });
});
