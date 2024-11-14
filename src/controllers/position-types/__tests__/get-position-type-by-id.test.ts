import request from 'supertest';
import app from '../../../app';
import {
  SUCCESS_MESSAGE,
  ID_NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} from '../../../constants/contants';
import * as PositionTypeService from '../../../services/position-type-service';
import { IPositionTypes } from '../../../interfaces/position.interface';

describe('getPositionTypeByIdController', () => {
  const validId = '12345';

  let getPositionTypeByIdServiceSpy: jest.SpyInstance;

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /position-type/:id', () => {
    it('should return status code 200 and the position type data if found', async () => {
      const mockPositionType = {
        _id: validId,
        name: 'Manager',
      } as IPositionTypes;
      getPositionTypeByIdServiceSpy = jest
        .spyOn(PositionTypeService, 'getPostionTypeByIdService')
        .mockResolvedValueOnce(mockPositionType);

      const response = await request(app)
        .get(`/api/position-type/${validId}`)
        .expect(200);

      expect(response.body).toEqual({
        message: SUCCESS_MESSAGE,
        data: mockPositionType,
        status: true,
      });
      expect(getPositionTypeByIdServiceSpy).toHaveBeenCalledWith(validId);
      expect(getPositionTypeByIdServiceSpy).toHaveBeenCalledTimes(1);
    });

    it('should return status code 404 if the position type is not found', async () => {
      getPositionTypeByIdServiceSpy = jest
        .spyOn(PositionTypeService, 'getPostionTypeByIdService')
        .mockResolvedValueOnce(null);

      const response = await request(app)
        .get(`/api/position-type/${validId}`)
        .expect(404);

      expect(response.body).toEqual({
        message: ID_NOT_FOUND,
        status: false,
      });
      expect(getPositionTypeByIdServiceSpy).toHaveBeenCalledWith(validId);
      expect(getPositionTypeByIdServiceSpy).toHaveBeenCalledTimes(1);
    });

    it('should return status code 500 if an unexpected error occurs', async () => {
      const errMessage = 'Database connection error';
      getPositionTypeByIdServiceSpy = jest
        .spyOn(PositionTypeService, 'getPostionTypeByIdService')
        .mockImplementationOnce(() => {
          throw new Error(errMessage);
        });

      const response = await request(app)
        .get(`/api/position-type/${validId}`)
        .expect(500);

      expect(response.body).toEqual({
        message: `${INTERNAL_SERVER_ERROR}: ${errMessage}`,
      });
      expect(getPositionTypeByIdServiceSpy).toHaveBeenCalledWith(validId);
      expect(getPositionTypeByIdServiceSpy).toHaveBeenCalledTimes(1);
    });
  });
});
