import request from 'supertest';
import app from '../../../app';
import {
  STATE_NOT_FOUND,
  SUCCESS_MESSAGE,
  INTERNAL_SERVER_ERROR,
} from '../../../constants/contants';
import * as StateService from '../../../services/state-service';
import { IState } from '../../../interfaces/state.interface';

describe('getStateByCountryController', () => {
  const mockCountryId = '648c1234abcd5678ef90abcd';
  let getStateByCountryIdServiceSpy: jest.SpyInstance;

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /state/country/:id', () => {
    it('should return status code 200 and state data if states exist for the given country', async () => {
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

      getStateByCountryIdServiceSpy = jest
        .spyOn(StateService, 'getStateByCountryIdService')
        .mockResolvedValueOnce(mockStates);

      const response = await request(app)
        .get(`/api/state/country/${mockCountryId}`)
        .expect(200);

      expect(response.body).toEqual({
        message: SUCCESS_MESSAGE,
        data: mockStates,
      });
      expect(getStateByCountryIdServiceSpy).toHaveBeenCalledWith(mockCountryId);
      expect(getStateByCountryIdServiceSpy).toHaveBeenCalledTimes(1);
    });

    it('should return status code 404 if no states are found for the given country ID', async () => {
      getStateByCountryIdServiceSpy = jest
        .spyOn(StateService, 'getStateByCountryIdService')
        .mockResolvedValueOnce(null);

      const response = await request(app)
        .get(`/api/state/country/${mockCountryId}`)
        .expect(404);

      expect(response.body).toEqual({
        message: STATE_NOT_FOUND,
      });
      expect(getStateByCountryIdServiceSpy).toHaveBeenCalledWith(mockCountryId);
      expect(getStateByCountryIdServiceSpy).toHaveBeenCalledTimes(1);
    });

    it('should return status code 500  if an unexpected error occurs', async () => {
      const errMessage = 'Invalid ID format';

      getStateByCountryIdServiceSpy = jest
        .spyOn(StateService, 'getStateByCountryIdService')
        .mockImplementationOnce(() => {
          throw new Error(errMessage);
        });

      const response = await request(app)
        .get(`/api/state/country/${mockCountryId}`)
        .expect(500);

      expect(response.body).toEqual({
        message: `${INTERNAL_SERVER_ERROR}: ${errMessage}`,
      });
      expect(getStateByCountryIdServiceSpy).toHaveBeenCalledWith(mockCountryId);
      expect(getStateByCountryIdServiceSpy).toHaveBeenCalledTimes(1);
    });
  });
});
