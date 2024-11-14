import request from 'supertest';
import app from '../../../app';
import {
  SUCCESS_MESSAGE,
  INTERNAL_SERVER_ERROR,
} from '../../../constants/contants';
import * as PositionTypeService from '../../../services/position-type-service';
import { IPositionTypes } from '../../../interfaces/position.interface';

describe('getAllPositionTypesController', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /position-type', () => {
    it('should return status code 200 and empty array if no position types exist', async () => {
      jest
        .spyOn(PositionTypeService, 'getAllPositionTypeService')
        .mockResolvedValueOnce([]);

      const response = await request(app).get(`/api/position-type`).expect(200);

      expect(response.body).toEqual({
        message: SUCCESS_MESSAGE,
        data: [],
        status: true,
      });
    });

    it('should return status code 200 and array of position types if they exist', async () => {
      const mockPositionTypes = [
        { _id: '1', name: 'Manager' },
        { _id: '2', name: 'Developer' },
      ] as IPositionTypes[];

      jest
        .spyOn(PositionTypeService, 'getAllPositionTypeService')
        .mockResolvedValueOnce(mockPositionTypes);

      const response = await request(app).get(`/api/position-type`).expect(200);

      expect(response.body).toEqual({
        message: SUCCESS_MESSAGE,
        data: mockPositionTypes,
        status: true,
      });
    });

    it('should return status code 500 if an unexpected error occurs', async () => {
      const errMessage = 'Database connection error';
      jest
        .spyOn(PositionTypeService, 'getAllPositionTypeService')
        .mockImplementationOnce(() => {
          throw new Error(errMessage);
        });

      const response = await request(app).get(`/api/position-type`).expect(500);

      expect(response.body).toEqual({
        message: `${INTERNAL_SERVER_ERROR}: ${errMessage}`,
      });
    });

    // Optional: Test for specific database errors if needed
    it('should handle specific database errors appropriately', async () => {
      const dbError = new Error('MongoDB connection failed');
      jest
        .spyOn(PositionTypeService, 'getAllPositionTypeService')
        .mockRejectedValueOnce(dbError);

      const response = await request(app).get(`/api/position-type`).expect(500);

      expect(response.body).toEqual({
        message: `${INTERNAL_SERVER_ERROR}: ${dbError.message}`,
      });
    });
  });
});
