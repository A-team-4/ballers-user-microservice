import request from 'supertest';
import app from '../../../app';
import {
  INTERNAL_SERVER_ERROR,
  SUCCESS_MESSAGE,
} from '../../../constants/contants';
import * as CountryService from '../../../services/country-service';

// Test delete country
describe('delete-country.ts', () => {
  const id = 'ashhja';
  let deleteCountryServiceSpy: jest.SpyInstance;

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('DELETE COUNTRY /', () => {
    it('should return status code 500 if an unexpected error occurs', async () => {
      const err_message = 'Unexpected Error';
      deleteCountryServiceSpy = jest
        .spyOn(CountryService, 'deleteCountryService')
        .mockImplementationOnce(() => {
          throw new Error(err_message);
        });
      const response = await request(app)
        .delete(`/api/country/${id}`)
        .expect(500);

      expect(response.body).toEqual(
        expect.objectContaining({
          message: `${INTERNAL_SERVER_ERROR}: ${err_message}`,
        }),
      );

      expect(deleteCountryServiceSpy).toHaveBeenCalledTimes(1);
      expect(deleteCountryServiceSpy).toHaveBeenCalledWith(id);
    });

    it('should return status code 200 if request successful', async () => {
      deleteCountryServiceSpy = jest
        .spyOn(CountryService, 'deleteCountryService')
        .mockResolvedValueOnce();
      const response = await request(app)
        .delete(`/api/country/${id}`)
        .expect(200);

      expect(response.body).toEqual(
        expect.objectContaining({
          message: SUCCESS_MESSAGE,
        }),
      );

      expect(deleteCountryServiceSpy).toHaveBeenCalledTimes(1);
      expect(deleteCountryServiceSpy).toHaveBeenCalledWith(id);
    });
  });
});
