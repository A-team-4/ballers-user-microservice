import request from 'supertest';
import app from '../../../app';
import {
  SUCCESS_MESSAGE,
  INTERNAL_SERVER_ERROR,
} from '../../../constants/contants';
import * as RoleService from '../../../services/role-service';
import { IRoleType } from '../../../interfaces/role.interface';

describe('getAllRolesController', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /roles', () => {
    it('should return status code 200 and empty array if no roles exist', async () => {
      jest.spyOn(RoleService, 'getAllRolesService').mockResolvedValueOnce([]);

      const response = await request(app).get(`/api/roles`).expect(200);

      expect(response.body).toEqual({
        message: SUCCESS_MESSAGE,
        data: [],
        status: true,
      });
    });

    it('should return status code 200 and array of roles if they exist', async () => {
      const mockRoles = [
        { _id: '1', type: 'Admin' },
        { _id: '2', type: 'User' },
      ] as IRoleType[];

      jest
        .spyOn(RoleService, 'getAllRolesService')
        .mockResolvedValueOnce(mockRoles);

      const response = await request(app).get(`/api/roles`).expect(200);

      expect(response.body).toEqual({
        message: SUCCESS_MESSAGE,
        data: mockRoles,
        status: true,
      });
    });

    it('should return status code 500 if an unexpected error occurs', async () => {
      const errMessage = 'Database connection error';
      jest
        .spyOn(RoleService, 'getAllRolesService')
        .mockImplementationOnce(() => {
          throw new Error(errMessage);
        });

      const response = await request(app).get(`/api/roles`).expect(500);

      expect(response.body).toEqual({
        message: `${INTERNAL_SERVER_ERROR}: ${errMessage}`,
      });
    });

    it('should handle specific database errors appropriately', async () => {
      const dbError = new Error('MongoDB connection failed');
      jest
        .spyOn(RoleService, 'getAllRolesService')
        .mockRejectedValueOnce(dbError);

      const response = await request(app).get(`/api/roles`).expect(500);

      expect(response.body).toEqual({
        message: `${INTERNAL_SERVER_ERROR}: ${dbError.message}`,
      });
    });
  });
});
