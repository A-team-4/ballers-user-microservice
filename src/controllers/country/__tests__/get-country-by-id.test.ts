// src/controllers/country/__tests__/get-country-by-id.test.ts

import request from 'supertest';
import app from '../../../app';
import {
  SUCCESS_MESSAGE,
  COUNTRY_NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} from '../../../constants/contants';
import * as CountryService from '../../../services/country-service';
import { ICountry } from '../../../interfaces/country.interface';

describe('get-country-by-id.ts', () => {
  const validId = '12345';

  let getCountryByIdServiceSpy: jest.SpyInstance;

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /country/:id', () => {
    it('should return status code 200 and the country data if found', async () => {
      const mockCountry = { _id: validId, name: 'Nigeria' } as ICountry;
      getCountryByIdServiceSpy = jest
        .spyOn(CountryService, 'getCountryByIdService')
        .mockResolvedValueOnce(mockCountry);

      const response = await request(app)
        .get(`/api/country/${validId}`)
        .expect(200);

      expect(response.body).toEqual({
        message: SUCCESS_MESSAGE,
        data: mockCountry,
      });
      expect(getCountryByIdServiceSpy).toHaveBeenCalledWith(validId);
      expect(getCountryByIdServiceSpy).toHaveBeenCalledTimes(1);
    });

    it('should return status code 404 if the country is not found', async () => {
      getCountryByIdServiceSpy = jest
        .spyOn(CountryService, 'getCountryByIdService')
        .mockResolvedValueOnce(null);

      const response = await request(app)
        .get(`/api/country/${validId}`)
        .expect(404);

      expect(response.body).toEqual({
        message: COUNTRY_NOT_FOUND,
      });
      expect(getCountryByIdServiceSpy).toHaveBeenCalledWith(validId);
      expect(getCountryByIdServiceSpy).toHaveBeenCalledTimes(1);
    });

    it('should return status code 500 if an unexpected error occurs', async () => {
      const errMessage = 'Database connection error';
      getCountryByIdServiceSpy = jest
        .spyOn(CountryService, 'getCountryByIdService')
        .mockImplementationOnce(() => {
          throw new Error(errMessage);
        });

      const response = await request(app)
        .get(`/api/country/${validId}`)
        .expect(500);

      expect(response.body).toEqual({
        message: `${INTERNAL_SERVER_ERROR}: ${errMessage}`,
      });
      expect(getCountryByIdServiceSpy).toHaveBeenCalledWith(validId);
      expect(getCountryByIdServiceSpy).toHaveBeenCalledTimes(1);
    });
  });
});
