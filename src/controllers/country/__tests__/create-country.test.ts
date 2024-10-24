import request from 'supertest';
import app from '../../../app';
import {
  COUNTRY_CREATED_MESSAGE,
  COUNTRY_RETRIEVED_SUCCESSFUL,
  INTERNAL_SERVER_ERROR,
  MONGO_SERVER_ERROR,
  MONGOOSE_DUPLICATE_ERROR_CODE,
  NAME_REQUIRED,
} from '../../../constants/contants';
import { IncomingMessage, Server, ServerResponse } from 'http';
import { generateRandomPortNumber } from '../../../utils/generateRandomPortNumber';
import * as CountryService from '../../../services/country-service';
import { ICountry } from '../../../interfaces/country.interface';

// Test create country
describe('create-country.ts', () => {
  let testServer: Server<typeof IncomingMessage, typeof ServerResponse>;
  const testPORT = generateRandomPortNumber();
  const body = { name: 'Nigeria' };
  beforeAll(() => {
    testServer = app.listen(testPORT, async () => {
      //console.log(`Listening on PORT: ${testPORT}`);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    testServer.close();
    testServer.closeAllConnections();
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
      jest.spyOn(CountryService, 'createCountryService').mockRejectedValueOnce({
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
    });

    it('should return status code 500 if an unexpected error occurs', async () => {
      const err_message = 'Unexpected Error';
      jest
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
    });

    it('should return status code 200 if request successful', async () => {
      jest
        .spyOn(CountryService, 'createCountryService')
        .mockResolvedValueOnce({ _id: 'asddd', name: body.name } as ICountry);
      const response = await request(app)
        .post(`/api/country`)
        .send(body)
        .expect(200);

      expect(response.body).toEqual(
        expect.objectContaining({
          message: COUNTRY_CREATED_MESSAGE,
        }),
      );
    });
  });
});

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
        message: COUNTRY_RETRIEVED_SUCCESSFUL,
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
        message: COUNTRY_RETRIEVED_SUCCESSFUL,
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
