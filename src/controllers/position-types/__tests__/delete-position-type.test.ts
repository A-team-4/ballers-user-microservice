import request from 'supertest';
import app from '../../../app';
import {
  ID_NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  SUCCESS_MESSAGE,
} from '../../../constants/contants';
import * as PositionTypeService from '../../../services/position-type-service';

describe('deletePositionTypeController', () => {
  const id = 'ashhja';
  let deletePositionTypeServiceSpy: jest.SpyInstance;

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('DELETE POSITION TYPE /', () => {
    it('should return status code 500 if an unexpected error occurs', async () => {
      const err_message = 'Unexpected Error';
      deletePositionTypeServiceSpy = jest
        .spyOn(PositionTypeService, 'deletePositionTypeService')
        .mockImplementationOnce(() => {
          throw new Error(err_message);
        });

      const response = await request(app)
        .delete(`/api/position-type/${id}`)
        .expect(500);

      expect(response.body).toEqual(
        expect.objectContaining({
          message: `${INTERNAL_SERVER_ERROR}: ${err_message}`,
        }),
      );

      expect(deletePositionTypeServiceSpy).toHaveBeenCalledTimes(1);
      expect(deletePositionTypeServiceSpy).toHaveBeenCalledWith(id);
    });

    it('should return status code 404 if position type not found', async () => {
      deletePositionTypeServiceSpy = jest
        .spyOn(PositionTypeService, 'deletePositionTypeService')
        .mockResolvedValueOnce(false);

      const response = await request(app)
        .delete(`/api/position-type/${id}`)
        .expect(404);

      expect(response.body).toEqual(
        expect.objectContaining({
          message: ID_NOT_FOUND,
          status: false,
        }),
      );

      expect(deletePositionTypeServiceSpy).toHaveBeenCalledTimes(1);
      expect(deletePositionTypeServiceSpy).toHaveBeenCalledWith(id);
    });

    it('should return status code 200 if request is successful', async () => {
      deletePositionTypeServiceSpy = jest
        .spyOn(PositionTypeService, 'deletePositionTypeService')
        .mockResolvedValueOnce(true);

      const response = await request(app)
        .delete(`/api/position-type/${id}`)
        .expect(200);

      expect(response.body).toEqual(
        expect.objectContaining({
          message: SUCCESS_MESSAGE,
          status: true,
        }),
      );

      expect(deletePositionTypeServiceSpy).toHaveBeenCalledTimes(1);
      expect(deletePositionTypeServiceSpy).toHaveBeenCalledWith(id);
    });
  });
});
