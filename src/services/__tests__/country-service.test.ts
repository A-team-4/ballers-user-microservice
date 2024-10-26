import {
  createCountryService,
  deleteCountryService,
  getAllCountryService,
} from '../../services/country-service';
import { Country } from '../../models/country';

// Test create country service
describe('create-country.ts', () => {
  const body = { name: 'Nigeria' };
  const expectedResult = { name: 'Nigeria', _id: 'aabbs', __v: 0 };

  describe('createCountryService', () => {
    it('should return created Country', async () => {
      (Country.create as jest.Mock).mockResolvedValueOnce(expectedResult);

      expect(await createCountryService(body.name)).toStrictEqual(
        expectedResult,
      );
      expect(Country.create).toHaveBeenCalledTimes(1);
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

//Test delete a country
describe('deleteCountryService', () => {
  it('should delete a country', async () => {
    const mockCountryId = 'id';

    // mock the find country method to return mock countries
    (Country.findByIdAndDelete as jest.Mock).mockResolvedValue(true);

    // Call the service
    await deleteCountryService(mockCountryId);

    expect(Country.findByIdAndDelete).toHaveBeenCalledTimes(1);
  });
});
