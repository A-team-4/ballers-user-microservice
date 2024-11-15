import request from 'supertest';
import app from '../../../app';
import {
  ID_NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  SUCCESS_MESSAGE,
} from '../../../constants/contants';
import * as RoleService from '../../../services/role-service';

describe('deleteRoleController', () => {
  const id = 'test-id';
  let deleteRoleServiceSpy: jest.SpyInstance;

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('DELETE ROLE /', () => {
    it('should return status code 500 if an unexpected error occurs', async () => {
      const err_message = 'Unexpected Error';
      deleteRoleServiceSpy = jest
        .spyOn(RoleService, 'deleteRoleService')
        .mockImplementationOnce(() => {
          throw new Error(err_message);
        });

      const response = await request(app).delete(`/api/role/${id}`).expect(500);

      expect(response.body).toEqual(
        expect.objectContaining({
          message: `${INTERNAL_SERVER_ERROR}: ${err_message}`,
        }),
      );

      expect(deleteRoleServiceSpy).toHaveBeenCalledTimes(1);
      expect(deleteRoleServiceSpy).toHaveBeenCalledWith(id);
    });

    it('should return status code 404 if role not found', async () => {
      deleteRoleServiceSpy = jest
        .spyOn(RoleService, 'deleteRoleService')
        .mockResolvedValueOnce(false);

      const response = await request(app).delete(`/api/role/${id}`).expect(404);

      expect(response.body).toEqual(
        expect.objectContaining({
          message: ID_NOT_FOUND,
          status: false,
        }),
      );

      expect(deleteRoleServiceSpy).toHaveBeenCalledTimes(1);
      expect(deleteRoleServiceSpy).toHaveBeenCalledWith(id);
    });

    it('should return status code 200 if request is successful', async () => {
      deleteRoleServiceSpy = jest
        .spyOn(RoleService, 'deleteRoleService')
        .mockResolvedValueOnce(true);

      const response = await request(app).delete(`/api/role/${id}`).expect(200);

      expect(response.body).toEqual(
        expect.objectContaining({
          message: SUCCESS_MESSAGE,
          status: true,
        }),
      );

      expect(deleteRoleServiceSpy).toHaveBeenCalledTimes(1);
      expect(deleteRoleServiceSpy).toHaveBeenCalledWith(id);
    });
  });
});
