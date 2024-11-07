import request from 'supertest';
import app from '../../../app';
import {
  STATE_NOT_FOUND,
  SUCCESS_MESSAGE,
  INTERNAL_SERVER_ERROR,
} from '../../../constants/contants';
import * as StateService from '../../../services/state-service';
import { IState } from '../../../interfaces/state.interface';

// Mocking the state-service and apiErrorHandler
jest.mock('../../../services/state-service');

// Test get state by ID
describe('get-state-by-id.ts', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /state/:id', () => {
    it('should return status code 200 and state data if state exists', async () => {
      const mockState = { _id: '1', name: 'Lagos' } as IState;

      // Mock the service response
      jest
        .spyOn(StateService, 'getStateByIdService')
        .mockResolvedValueOnce(mockState);

      const response = await request(app).get(`/api/state/1`).expect(200);

      expect(response.body).toEqual({
        message: SUCCESS_MESSAGE,
        data: mockState,
      });
    });

    it('should return status code 404 if state is not found', async () => {
      // Mock the service to return null
      jest
        .spyOn(StateService, 'getStateByIdService')
        .mockResolvedValueOnce(null);

      const response = await request(app).get(`/api/state/1`).expect(404);

      expect(response.body).toEqual({
        message: STATE_NOT_FOUND,
      });
    });

    it('should return status code 500 and call apiErrorHandler if an unexpected error occurs', async () => {
      const errMessage = 'Unexpected error';
      const error = new Error(errMessage);

      // Mock the service to throw an error
      jest.spyOn(StateService, 'getStateByIdService').mockRejectedValue(error);

      const response = await request(app).get(`/api/state/1`).expect(500);

      expect(response.body).toEqual({
        message: `${INTERNAL_SERVER_ERROR}: ${error.message}`,
      });
    });
  });
});
