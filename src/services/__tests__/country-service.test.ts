import {
  createCountryService,
  deleteCountryService,
  getAllCountryService,
  updateCountryService,
  getCountryByIdService,
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

// Test get country by ID service
describe('getCountryByIdService', () => {
  const mockCountryId = 'aabbs';
  const mockCountry = { _id: mockCountryId, name: 'Nigeria' };

  it('should return the country if found', async () => {
    // Mock the findById method to return a specific country
    (Country.findById as jest.Mock).mockResolvedValue(mockCountry);

    // Call the service with a valid ID and assert it returns the expected country
    const result = await getCountryByIdService(mockCountryId);
    expect(result).toEqual(mockCountry);
    expect(Country.findById).toHaveBeenCalledWith(mockCountryId);
    expect(Country.findById).toHaveBeenCalledTimes(1);
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

// Test update a country
describe('updateCountryService', () => {
  it('should update and return the updated country', async () => {
    const mockCountry = { _id: '123', name: 'naija' };

    // mock the find and update country method to return mock countries
    (Country.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockCountry);

    //call the service
    const result = await updateCountryService(
      mockCountry._id,
      mockCountry.name,
    );
    expect(Country.findByIdAndUpdate).toHaveBeenCalledWith(
      mockCountry._id,
      { name: mockCountry.name },
      { new: true, runValidators: true },
    );
    expect(result).toEqual(mockCountry);
  });

  // Test for non-existent Id
  it('should return null if the country does not exist', async () => {
    (Country.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

    const result = await updateCountryService('null', 'naija');
    expect(result).toBeNull();
  });
});
