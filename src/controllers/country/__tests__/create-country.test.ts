import request from 'supertest';
import app from '../../../app';
import {
  COUNTRY_CREATED_MESSAGE,
  INTERNAL_SERVER_ERROR,
  MONGO_SERVER_ERROR,
  MONGOOSE_DUPLICATE_ERROR_CODE,
  NAME_REQUIRED,
} from '../../../constants/contants';
import * as CountryService from '../../../services/country-service';
import { ICountry } from '../../../interfaces/country.interface';

// Test create country
describe('create-country.ts', () => {
  const body = { name: 'Nigeria' };
  let createCountryServiceSpy: jest.SpyInstance;

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /', () => {
    it('should return status code 422 if body is empty', async () => {
      const response = await request(app).post(`/api/country`).expect(422);

      expect(response.body).toEqual(
        expect.objectContaining({
          message: NAME_REQUIRED,
        }),
      );
    });

    it('should return status code 400 if country name already exists', async () => {
      createCountryServiceSpy = jest
        .spyOn(CountryService, 'createCountryService')
        .mockRejectedValueOnce({
          name: MONGO_SERVER_ERROR,
          code: MONGOOSE_DUPLICATE_ERROR_CODE,
          keyValue: body,
        });
      const response = await request(app)
        .post(`/api/country`)
        .send(body)
        .expect(400);

      expect(response.body).toEqual(
        expect.objectContaining({
          message: 'name already exists',
        }),
      );

      expect(createCountryServiceSpy).toHaveBeenCalledTimes(1);
    });

    it('should return status code 500 if an unexpected error occurs', async () => {
      const err_message = 'Unexpected Error';
      createCountryServiceSpy = jest
        .spyOn(CountryService, 'createCountryService')
        .mockImplementationOnce(() => {
          throw new Error(err_message);
        });
      const response = await request(app)
        .post(`/api/country`)
        .send(body)
        .expect(500);

      expect(response.body).toEqual(
        expect.objectContaining({
          message: `${INTERNAL_SERVER_ERROR}: ${err_message}`,
        }),
      );

      expect(createCountryServiceSpy).toHaveBeenCalledTimes(1);
    });

    it('should return status code 200 if request successful', async () => {
      createCountryServiceSpy = jest
        .spyOn(CountryService, 'createCountryService')
        .mockResolvedValueOnce({ _id: 'asddd', name: body.name } as ICountry);
      const response = await request(app)
        .post(`/api/country`)
        .send(body)
        .expect(201);

      expect(response.body).toEqual(
        expect.objectContaining({
          message: COUNTRY_CREATED_MESSAGE,
        }),
      );

      expect(createCountryServiceSpy).toHaveBeenCalledTimes(1);
    });
  });
});
