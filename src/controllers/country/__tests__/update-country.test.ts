import request from 'supertest';
import app from '../../../app';
import {
  SUCCESS_MESSAGE,
  INTERNAL_SERVER_ERROR,
  NAME_REQUIRED,
  COUNTRY_NOT_FOUND,
} from '../../../constants/contants';
import * as CountryService from '../../../services/country-service';
import { ICountry } from '../../../interfaces/country.interface';

// Test Update country Controller
describe('update-country.ts', () => {
  const id = '123';
  const updatedCountry = { name: 'Nigeria' };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('PUT /country/:id', () => {
    it('should return status code 400 if name is not provided', async () => {
      const response = await request(app)
        .put(`/api/country/${id}`)
        .send({})
        .expect(400);

      expect(response.body).toEqual({
        message: NAME_REQUIRED,
      });
    });

    it('should return status code 404 if country is not found', async () => {
      jest
        .spyOn(CountryService, 'updateCountryService')
        .mockResolvedValueOnce(null);

      const response = await request(app)
        .put(`/api/country/${id}`)
        .send(updatedCountry)
        .expect(404);

      expect(response.body).toEqual({
        message: COUNTRY_NOT_FOUND,
      });
    });

    it('should return status code 200 if country is successfully updated', async () => {
      const result = {
        _id: id,
        name: updatedCountry.name,
      } as ICountry;

      jest
        .spyOn(CountryService, 'updateCountryService')
        .mockResolvedValueOnce(result);

      const response = await request(app)
        .put(`/api/country/${id}`)
        .send(updatedCountry)
        .expect(200);

      expect(response.body).toEqual({
        message: SUCCESS_MESSAGE,
        data: result,
      });

      expect(CountryService.updateCountryService).toHaveBeenCalledWith(
        id,
        updatedCountry.name,
      );
    });

    it('should return status code 500 if an unexpected error occurs', async () => {
      const err_message = 'Unexpected Error';
      jest
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
    });
  });
});
