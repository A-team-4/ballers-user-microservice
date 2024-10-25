import request from 'supertest';
import app from '../../../app';
import {
  SUCCESS_MESSAGE,
  INTERNAL_SERVER_ERROR,
} from '../../../constants/contants';
import { IncomingMessage, Server, ServerResponse } from 'http';
import { generateRandomPortNumber } from '../../../utils/generateRandomPortNumber';
import * as CountryService from '../../../services/country-service';
import { ICountry } from '../../../interfaces/country.interface';

// Test get all country
describe('get-country.ts', () => {
  let testServer: Server<typeof IncomingMessage, typeof ServerResponse>;
  const testPORT = generateRandomPortNumber();

  beforeAll(() => {
    testServer = app.listen(testPORT, async () => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    testServer.close();
    testServer.closeAllConnections();
  });

  describe('GET /country', () => {
    it('should return status code 200 and empty array if no countries exist', async () => {
      jest
        .spyOn(CountryService, 'getAllCountryService')
        .mockResolvedValueOnce([]);

      const response = await request(app).get(`/api/country`).expect(200);

      expect(response.body).toEqual({
        message: SUCCESS_MESSAGE,
        data: [],
      });
    });

    it('should return status code 200 and array of countries if countries exist', async () => {
      const mockCountries = [
        { _id: '1', name: 'Nigeria' },
        { _id: '2', name: 'Ghana' },
      ] as ICountry[];

      jest
        .spyOn(CountryService, 'getAllCountryService')
        .mockResolvedValueOnce(mockCountries);

      const response = await request(app).get(`/api/country`).expect(200);

      expect(response.body).toEqual({
        message: SUCCESS_MESSAGE,
        data: mockCountries,
      });
    });

    it('should return status code 500 if an unexpected error occurs', async () => {
      const err_message = 'Database connection error';
      jest
        .spyOn(CountryService, 'getAllCountryService')
        .mockImplementationOnce(() => {
          throw new Error(err_message);
        });

      const response = await request(app).get(`/api/country`).expect(500);

      expect(response.body).toEqual({
        message: `${INTERNAL_SERVER_ERROR}: ${err_message}`,
      });
    });

    // Optional: Test for specific database errors if needed
    it('should handle specific database errors appropriately', async () => {
      const dbError = new Error('MongoDB connection failed');
      jest
        .spyOn(CountryService, 'getAllCountryService')
        .mockRejectedValueOnce(dbError);

      const response = await request(app).get(`/api/country`).expect(500);

      expect(response.body).toEqual({
        message: `${INTERNAL_SERVER_ERROR}: ${dbError.message}`,
      });
    });
  });
});
