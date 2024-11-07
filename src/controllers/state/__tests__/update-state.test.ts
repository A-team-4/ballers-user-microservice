import request from 'supertest';
import app from '../../../app';
import {
  INVALID_COUNTRY_ID,
  NAME_REQUIRED,
  STATE_NOT_FOUND,
  SUCCESS_MESSAGE,
  INTERNAL_SERVER_ERROR,
  INVALID_STATE_ID,
} from '../../../constants/contants';
import * as StateService from '../../../services/state-service';
import { IState } from '../../../interfaces/state.interface';
import mongoose from 'mongoose';
import { StateInput } from '../../../types/state';

jest.mock('../../../services/state-service');

describe('update-state.ts', () => {
  const countryId = new mongoose.Types.ObjectId();
  const mockInput: StateInput = {
    name: 'Updated State',
    countryId: countryId.toString(),
  };

  const mockState: Partial<IState> = {
    _id: new mongoose.Types.ObjectId().toString(),
    name: 'Updated State',
    countryId,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('PUT /state/:id', () => {
    it('should return 200 and the updated state data if successful', async () => {
      jest
        .spyOn(StateService, 'updateStateService')
        .mockResolvedValueOnce(mockState as unknown as IState);

      const response = await request(app)
        .put(`/api/state/${mockState._id}`)
        .send(mockInput)
        .expect(200);

      expect(response.body).toEqual({
        message: SUCCESS_MESSAGE,
        data: { ...mockState, countryId: mockState.countryId?.toString() },
      });
    });

    it('should return 400 if name is missing', async () => {
      const response = await request(app)
        .put(`/api/state/${mockState._id}`)
        .send({ countryId: 'country123' })
        .expect(400);

      expect(response.body).toEqual({
        message: NAME_REQUIRED,
      });
    });

    it('should return 400 if state ID is invalid', async () => {
      const response = await request(app)
        .put('/api/state/invalid_id')
        .send({ name: 'Updated State', countryId: 'country123' })
        .expect(400);

      expect(response.body).toEqual({
        message: INVALID_STATE_ID,
      });
    });

    it('should return 400 if Country ID is invalid', async () => {
      const response = await request(app)
        .put(`/api/state/${mockState._id}`)
        .send({ name: 'Updated State', countryId: 'country123' })
        .expect(400);

      expect(response.body).toEqual({
        message: INVALID_COUNTRY_ID,
      });
    });

    it('should return 404 if the state is not found', async () => {
      jest
        .spyOn(StateService, 'updateStateService')
        .mockResolvedValueOnce(null);

      const response = await request(app)
        .put(`/api/state/${mockState._id}`)
        .send(mockInput)
        .expect(404);

      expect(response.body).toEqual({
        message: STATE_NOT_FOUND,
      });
    });

    it('should return 500 and call apiErrorHandler if an unexpected error occurs', async () => {
      const errorMessage = 'Unexpected error';
      const error = new Error(errorMessage);

      jest
        .spyOn(StateService, 'updateStateService')
        .mockRejectedValueOnce(error);

      const response = await request(app)
        .put(`/api/state/${mockState._id}`)
        .send(mockInput)
        .expect(500);

      expect(response.body).toEqual({
        message: `${INTERNAL_SERVER_ERROR}: ${error.message}`,
      });
    });
  });
});
