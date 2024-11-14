import request from 'supertest';
import app from '../../../app';
import {
  NAME_REQUIRED,
  POSITION_TYPE_CREATED,
  INTERNAL_SERVER_ERROR,
  MONGO_SERVER_ERROR,
  MONGOOSE_DUPLICATE_ERROR_CODE,
} from '../../../constants/contants';
import * as PositionTypeService from '../../../services/position-type-service';

describe('createPositionTypeController', () => {
  const body = { name: 'Manager' };
  let createPositionTypeServiceSpy: jest.SpyInstance;

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /', () => {
    it('should return status code 422 if body is empty', async () => {
      const response = await request(app)
        .post(`/api/position-type`)
        .expect(422);

      expect(response.body).toEqual(
        expect.objectContaining({
          message: NAME_REQUIRED,
        }),
      );
    });

    it('should return status code 400 if position type name already exists', async () => {
      createPositionTypeServiceSpy = jest
        .spyOn(PositionTypeService, 'createPositionTypeService')
        .mockRejectedValueOnce({
          name: MONGO_SERVER_ERROR,
          code: MONGOOSE_DUPLICATE_ERROR_CODE,
          keyValue: body,
        });

      const response = await request(app)
        .post(`/api/position-type`)
        .send(body)
        .expect(400);

      expect(response.body).toEqual(
        expect.objectContaining({
          message: 'name already exists',
        }),
      );

      expect(createPositionTypeServiceSpy).toHaveBeenCalledTimes(1);
    });

    it('should return status code 500 if an unexpected error occurs', async () => {
      const err_message = 'Unexpected Error';
      createPositionTypeServiceSpy = jest
        .spyOn(PositionTypeService, 'createPositionTypeService')
        .mockImplementationOnce(() => {
          throw new Error(err_message);
        });

      const response = await request(app)
        .post(`/api/position-type`)
        .send(body)
        .expect(500);

      expect(response.body).toEqual(
        expect.objectContaining({
          message: `${INTERNAL_SERVER_ERROR}: ${err_message}`,
        }),
      );

      expect(createPositionTypeServiceSpy).toHaveBeenCalledTimes(1);
    });

    it('should return status code 201 if request is successful', async () => {
      createPositionTypeServiceSpy = jest
        .spyOn(PositionTypeService, 'createPositionTypeService')
        .mockResolvedValueOnce({ _id: 'abcd1234', name: body.name });

      const response = await request(app)
        .post(`/api/position-type`)
        .send(body)
        .expect(201);

      expect(response.body).toEqual(
        expect.objectContaining({
          message: POSITION_TYPE_CREATED,
          status: true,
        }),
      );

      expect(createPositionTypeServiceSpy).toHaveBeenCalledTimes(1);
    });
  });
});
