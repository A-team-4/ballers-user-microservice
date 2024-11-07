import {
  createCountryService,
  deleteCountryService,
  getAllCountryService,
  updateCountryService,
  getCountryByIdService,
} from '../../services/country-service';
import { Country } from '../../models/country';
import { ICountry } from '../../interfaces/country.interface';
import mongoose from 'mongoose';

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
    const mockCountries = [
      { name: 'Nigeria' },
      { name: 'Ghana' },
    ] as ICountry[];

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
    const mockCountryId = new mongoose.Types.ObjectId().toString();

    // mock the find country method to return mock countries
    (Country.findByIdAndDelete as jest.Mock).mockResolvedValue(true);

    // Call the service
    await deleteCountryService(mockCountryId);

    expect(Country.findByIdAndDelete).toHaveBeenCalledTimes(1);
  });
});

// Test update a country
// Mock the Country model
jest.mock('../../models/country');

describe('updateCountryService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update and return the updated country if the ID is valid', async () => {
    const mockCountry: ICountry = {
      _id: new mongoose.Types.ObjectId().toString(),
      name: 'Nigeria',
    } as ICountry;

    // Mock the findByIdAndUpdate method to return the mock country
    (Country.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockCountry);

    // Call the service
    const result = await updateCountryService(
      mockCountry._id as string,
      'New Nigeria',
    );

    // Assert: Check if the service returns the updated data
    expect(result).toEqual(mockCountry);
    expect(Country.findByIdAndUpdate).toHaveBeenCalledWith(
      mockCountry._id,
      { name: 'New Nigeria' },
      { new: true, runValidators: true },
    );
    expect(Country.findByIdAndUpdate).toHaveBeenCalledTimes(1);
  });

  it('should return null if the country does not exist', async () => {
    const validNonexistentId = new mongoose.Types.ObjectId().toString();

    // Mock the findByIdAndUpdate method to return null
    (Country.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

    const result = await updateCountryService(
      validNonexistentId,
      'New Country',
    );

    // Assert: Check if the service returns null when the country is not found
    expect(result).toBeNull();
    expect(Country.findByIdAndUpdate).toHaveBeenCalledWith(
      validNonexistentId,
      { name: 'New Country' },
      { new: true, runValidators: true },
    );
    expect(Country.findByIdAndUpdate).toHaveBeenCalledTimes(1);
  });

  it('should throw an error if an invalid ID format is provided', async () => {
    const invalidId = 'invalid_id_format';

    // Call the service with the invalid ID and expect it to throw an error
    await expect(
      updateCountryService(invalidId, 'Invalid Country'),
    ).rejects.toThrow('Invalid ID format');
    expect(Country.findByIdAndUpdate).not.toHaveBeenCalled();
  });

  it('should throw an error if an unexpected error occurs', async () => {
    const errorMessage = 'Database connection error';
    const validId = new mongoose.Types.ObjectId().toString();

    // Mock the findByIdAndUpdate method to throw an error
    (Country.findByIdAndUpdate as jest.Mock).mockRejectedValueOnce(
      new Error(errorMessage),
    );

    await expect(
      updateCountryService(validId, 'Country with Error'),
    ).rejects.toThrow(errorMessage);
    expect(Country.findByIdAndUpdate).toHaveBeenCalledWith(
      validId,
      { name: 'Country with Error' },
      { new: true, runValidators: true },
    );
    expect(Country.findByIdAndUpdate).toHaveBeenCalledTimes(1);
  });
});
