import request from 'supertest';
import app from '../../../app';
import {
  SUCCESS_MESSAGE,
  ID_NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} from '../../../constants/contants';
import * as RoleService from '../../../services/role-service';
import { IRoleType } from '../../../interfaces/role.interface';

describe('getRoleByIdController', () => {
  const validId = '12345';

  let getRoleByIdServiceSpy: jest.SpyInstance;

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /role/:id', () => {
    it('should return status code 200 and the role data if found', async () => {
      const mockRole = {
        _id: validId,
        name: 'Administrator',
      } as unknown as Partial<IRoleType> as IRoleType;
      getRoleByIdServiceSpy = jest
        .spyOn(RoleService, 'getRoleByIdService')
        .mockResolvedValueOnce(mockRole);

      const response = await request(app)
        .get(`/api/role/${validId}`)
        .expect(200);

      expect(response.body).toEqual({
        message: SUCCESS_MESSAGE,
        data: mockRole,
        status: true,
      });
      expect(getRoleByIdServiceSpy).toHaveBeenCalledWith(validId);
      expect(getRoleByIdServiceSpy).toHaveBeenCalledTimes(1);
    });

    it('should return status code 404 if the role is not found', async () => {
      getRoleByIdServiceSpy = jest
        .spyOn(RoleService, 'getRoleByIdService')
        .mockResolvedValueOnce(null);

      const response = await request(app)
        .get(`/api/role/${validId}`)
        .expect(404);

      expect(response.body).toEqual({
        message: ID_NOT_FOUND,
        status: false,
      });
      expect(getRoleByIdServiceSpy).toHaveBeenCalledWith(validId);
      expect(getRoleByIdServiceSpy).toHaveBeenCalledTimes(1);
    });

    it('should return status code 500 if an unexpected error occurs', async () => {
      const errMessage = 'Database connection error';
      getRoleByIdServiceSpy = jest
        .spyOn(RoleService, 'getRoleByIdService')
        .mockImplementationOnce(() => {
          throw new Error(errMessage);
        });

      const response = await request(app)
        .get(`/api/role/${validId}`)
        .expect(500);

      expect(response.body).toEqual({
        message: `${INTERNAL_SERVER_ERROR}: ${errMessage}`,
      });
      expect(getRoleByIdServiceSpy).toHaveBeenCalledWith(validId);
      expect(getRoleByIdServiceSpy).toHaveBeenCalledTimes(1);
    });
  });
});
