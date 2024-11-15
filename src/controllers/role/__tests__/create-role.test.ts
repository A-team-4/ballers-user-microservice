import request from 'supertest';
import app from '../../../app';
import {
  ROLE_CREATED_MESSAGE,
  TYPE_REQUIRED,
  INTERNAL_SERVER_ERROR,
  MONGO_SERVER_ERROR,
  MONGOOSE_DUPLICATE_ERROR_CODE,
} from '../../../constants/contants';
import * as RoleService from '../../../services/role-service';

describe('createRoleController', () => {
  const body = { type: 'Admin' };
  let createRoleServiceSpy: jest.SpyInstance;

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/role', () => {
    it('should return status code 422 if body is empty', async () => {
      const response = await request(app).post(`/api/role`).expect(422);

      expect(response.body).toEqual(
        expect.objectContaining({
          message: TYPE_REQUIRED,
        }),
      );
    });

    it('should return status code 400 if role type already exists', async () => {
      createRoleServiceSpy = jest
        .spyOn(RoleService, 'createRoleService')
        .mockRejectedValueOnce({
          name: MONGO_SERVER_ERROR,
          code: MONGOOSE_DUPLICATE_ERROR_CODE,
          keyValue: body,
        });

      const response = await request(app)
        .post(`/api/role`)
        .send(body)
        .expect(400);

      expect(response.body).toEqual(
        expect.objectContaining({
          message: 'type already exists',
        }),
      );

      expect(createRoleServiceSpy).toHaveBeenCalledTimes(1);
    });

    it('should return status code 500 if an unexpected error occurs', async () => {
      const err_message = 'Unexpected Error';
      createRoleServiceSpy = jest
        .spyOn(RoleService, 'createRoleService')
        .mockImplementationOnce(() => {
          throw new Error(err_message);
        });

      const response = await request(app)
        .post(`/api/role`)
        .send(body)
        .expect(500);

      expect(response.body).toEqual(
        expect.objectContaining({
          message: `${INTERNAL_SERVER_ERROR}: ${err_message}`,
        }),
      );

      expect(createRoleServiceSpy).toHaveBeenCalledTimes(1);
    });

    it('should return status code 201 if request is successful', async () => {
      createRoleServiceSpy = jest
        .spyOn(RoleService, 'createRoleService')
        .mockResolvedValueOnce({ _id: 'abcd1234', type: body.type });

      const response = await request(app)
        .post(`/api/role`)
        .send(body)
        .expect(201);

      expect(response.body).toEqual(
        expect.objectContaining({
          message: ROLE_CREATED_MESSAGE,
          status: true,
        }),
      );

      expect(createRoleServiceSpy).toHaveBeenCalledTimes(1);
    });
  });
});
