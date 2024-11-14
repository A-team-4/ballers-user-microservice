import request from 'supertest';
import app from '../../../app';
import {
  SUCCESS_MESSAGE,
  INTERNAL_SERVER_ERROR,
  NAME_REQUIRED,
  ID_NOT_FOUND,
} from '../../../constants/contants';
import * as PositionTypeService from '../../../services/position-type-service';
import { IPositionTypes } from '../../../interfaces/position.interface';

describe('updatePositionTypesController', () => {
  const id = '123';
  const updatedPositionType = { name: 'Manager' };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('PUT /position-type/:id', () => {
    it('should return status code 400 if name is not provided', async () => {
      const response = await request(app)
        .put(`/api/position-type/${id}`)
        .send({})
        .expect(400);

      expect(response.body).toEqual({
        message: NAME_REQUIRED,
      });
    });

    it('should return status code 404 if position type is not found', async () => {
      jest
        .spyOn(PositionTypeService, 'updatePositionTypeService')
        .mockResolvedValueOnce(null);

      const response = await request(app)
        .put(`/api/position-type/${id}`)
        .send(updatedPositionType)
        .expect(404);

      expect(response.body).toEqual({
        message: ID_NOT_FOUND,
      });
    });

    it('should return status code 200 if position type is successfully updated', async () => {
      const result = {
        _id: id,
        name: updatedPositionType.name,
      } as IPositionTypes;

      jest
        .spyOn(PositionTypeService, 'updatePositionTypeService')
        .mockResolvedValueOnce(result);

      const response = await request(app)
        .put(`/api/position-type/${id}`)
        .send(updatedPositionType)
        .expect(200);

      expect(response.body).toEqual({
        message: SUCCESS_MESSAGE,
        data: result,
        status: true,
      });

      expect(
        PositionTypeService.updatePositionTypeService,
      ).toHaveBeenCalledWith(id, updatedPositionType.name);
    });

    it('should return status code 500 if an unexpected error occurs', async () => {
      const errMessage = 'Unexpected Error';
      jest
        .spyOn(PositionTypeService, 'updatePositionTypeService')
        .mockImplementationOnce(() => {
          throw new Error(errMessage);
        });

      const response = await request(app)
        .put(`/api/position-type/${id}`)
        .send(updatedPositionType)
        .expect(500);

      expect(response.body).toEqual(
        expect.objectContaining({
          message: `${INTERNAL_SERVER_ERROR}: ${errMessage}`,
        }),
      );
    });
  });
});
