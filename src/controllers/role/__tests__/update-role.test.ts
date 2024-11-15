import request from 'supertest';
import app from '../../../app';
import {
  ID_NOT_FOUND,
  TYPE_REQUIRED,
  SUCCESS_MESSAGE,
  INTERNAL_SERVER_ERROR,
} from '../../../constants/contants';
import * as RoleService from '../../../services/role-service';
import { IRoleType } from '../../../interfaces/role.interface';

describe('updateRoleController', () => {
  const id = '123';
  const updatedRoleType = { type: 'Admin' };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('PUT /role/:id', () => {
    it('should return status code 400 if type is not provided', async () => {
      const response = await request(app)
        .put(`/api/role/${id}`)
        .send({})
        .expect(400);

      expect(response.body).toEqual({
        message: TYPE_REQUIRED,
      });
    });

    it('should return status code 404 if role is not found', async () => {
      jest.spyOn(RoleService, 'updateRoleService').mockResolvedValueOnce(null);

      const response = await request(app)
        .put(`/api/role/${id}`)
        .send(updatedRoleType)
        .expect(404);

      expect(response.body).toEqual({
        message: ID_NOT_FOUND,
      });
    });

    it('should return status code 200 if role is successfully updated', async () => {
      const result = {
        _id: id,
        type: updatedRoleType.type,
      } as IRoleType;

      jest
        .spyOn(RoleService, 'updateRoleService')
        .mockResolvedValueOnce(result);

      const response = await request(app)
        .put(`/api/role/${id}`)
        .send(updatedRoleType)
        .expect(200);

      expect(response.body).toEqual({
        message: SUCCESS_MESSAGE,
        data: result,
        status: true,
      });

      expect(RoleService.updateRoleService).toHaveBeenCalledWith(
        id,
        updatedRoleType.type,
      );
    });

    it('should return status code 500 if an unexpected error occurs', async () => {
      const errMessage = 'Unexpected Error';
      jest
        .spyOn(RoleService, 'updateRoleService')
        .mockImplementationOnce(() => {
          throw new Error(errMessage);
        });

      const response = await request(app)
        .put(`/api/role/${id}`)
        .send(updatedRoleType)
        .expect(500);

      expect(response.body).toEqual(
        expect.objectContaining({
          message: `${INTERNAL_SERVER_ERROR}: ${errMessage}`,
        }),
      );
    });
  });
});
