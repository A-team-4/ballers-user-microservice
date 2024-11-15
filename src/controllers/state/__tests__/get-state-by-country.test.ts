import request from 'supertest';
import app from '../../../app';
import {
  STATE_NOT_FOUND,
  SUCCESS_MESSAGE,
  INTERNAL_SERVER_ERROR,
} from '../../../constants/contants';
import * as StateService from '../../../services/state-service';
import { IState } from '../../../interfaces/state.interface';

/* // Mocking the state-service and apiErrorHandler
jest.mock('../../../services/state-service'); */

describe('getStateByCountryController', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /state/:countryId', () => {
    it('should return status code 200 and state data if states exist for the given country', async () => {
      const mockCountryId = '1890ab';
      const mockStates = [
        {
          _id: '1',
          name: 'Lagos',
          countryId: mockCountryId,
        } as unknown as IState,
        {
          _id: '2',
          name: 'Abuja',
          countryId: mockCountryId,
        } as unknown as IState,
      ] as IState[];

      // Mock the service response
      jest
        .spyOn(StateService, 'getStateByCountryIdService')
        .mockResolvedValueOnce(mockStates);

      const response = await request(app)
        .get(`/state/:${mockCountryId}`)
        .expect(200);

      expect(response.body).toEqual({
        message: SUCCESS_MESSAGE,
        data: mockStates,
      });
    });

    it('should return status code 404 if no states are found for the given country ID', async () => {
      const mockCountryId = '1234567890abcdef12345678';

      // Mock the service to return an empty array
      jest
        .spyOn(StateService, 'getStateByCountryIdService')
        .mockResolvedValueOnce([]);

      const response = await request(app)
        .get(`/state/:${mockCountryId}`)
        .expect(404);

      expect(response.body).toEqual({
        message: STATE_NOT_FOUND,
      });
    });

    it('should return status code 500  if an unexpected error occurs', async () => {
      const mockCountryId = '1234567890abcdef12345678';
      const errMessage = 'Unexpected error';
      const error = new Error(errMessage);

      // Mock the service to throw an error
      jest
        .spyOn(StateService, 'getStateByCountryIdService')
        .mockRejectedValueOnce(error);

      const response = await request(app)
        .get(`/state/:${mockCountryId}`)
        .expect(500);

      expect(response.body).toEqual({
        message: `${INTERNAL_SERVER_ERROR}: ${error.message}`,
      });
    });
  });
});
