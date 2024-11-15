import mongoose from 'mongoose';
import {
  createRoleService,
  getAllRolesService,
  getRoleByIdService,
  deleteRoleService,
  updateRoleService,
} from '../../services/role-service';
import { RoleType } from '../../models/role';
import { IRoleType } from '../../interfaces/role.interface';

jest.mock('../../models/role');

describe('RoleType Services', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  // Test create role service
  describe('createRoleService', () => {
    const body = { type: 'Admin' };
    const expectedResult = { type: 'Admin', _id: 'aabbs', __v: 0 };

    it('should return created RoleType', async () => {
      (RoleType.create as jest.Mock).mockResolvedValueOnce(expectedResult);

      expect(await createRoleService(body.type)).toStrictEqual(expectedResult);
      expect(RoleType.create).toHaveBeenCalledWith({ type: body.type });
      expect(RoleType.create).toHaveBeenCalledTimes(1);
    });
  });

  // Test get all roles service
  describe('getAllRolesService', () => {
    it('should return all roles', async () => {
      const mockRoles = [{ type: 'Admin' }, { type: 'User' }] as IRoleType[];

      (RoleType.find as jest.Mock).mockResolvedValue(mockRoles);

      const result = await getAllRolesService();

      expect(result).toEqual(mockRoles);
      expect(RoleType.find).toHaveBeenCalledTimes(1);
    });
  });

  // Test get role by ID service
  describe('getRoleByIdService', () => {
    const mockRoleId = 'aabbs';
    const mockRole = { _id: mockRoleId, type: 'Admin' };

    it('should return the role if found', async () => {
      (RoleType.findById as jest.Mock).mockResolvedValue(mockRole);

      const result = await getRoleByIdService(mockRoleId);
      expect(result).toEqual(mockRole);
      expect(RoleType.findById).toHaveBeenCalledWith(mockRoleId);
      expect(RoleType.findById).toHaveBeenCalledTimes(1);
    });
  });

  // Test delete a role service
  describe('deleteRoleService', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it('should delete a role', async () => {
      const mockRoleId = new mongoose.Types.ObjectId().toString();

      (RoleType.findByIdAndDelete as jest.Mock).mockResolvedValue(true);

      const response = await deleteRoleService(mockRoleId);

      expect(response).toBeTruthy();

      expect(RoleType.findByIdAndDelete).toHaveBeenCalledWith(mockRoleId);
      expect(RoleType.findByIdAndDelete).toHaveBeenCalledTimes(1);
    });

    it('should return false if no data deleted', async () => {
      const mockRoleId = new mongoose.Types.ObjectId().toString();

      (RoleType.findByIdAndDelete as jest.Mock).mockResolvedValue(false);

      const response = await deleteRoleService(mockRoleId);

      expect(response).toBeFalsy();

      expect(RoleType.findByIdAndDelete).toHaveBeenCalledWith(mockRoleId);
      expect(RoleType.findByIdAndDelete).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if an invalid ID format is provided', async () => {
      const invalidId = 'invalid_id_format';

      await expect(deleteRoleService(invalidId)).rejects.toThrow(
        'Invalid ID format',
      );
      expect(RoleType.findByIdAndDelete).not.toHaveBeenCalled();
    });
  });

  // Test update a role service
  describe('updateRoleService', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should update and return the updated role if the ID is valid', async () => {
      const mockRole: IRoleType = {
        _id: new mongoose.Types.ObjectId().toString(),
        type: 'Admin',
      } as IRoleType;

      (RoleType.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockRole);

      const result = await updateRoleService(
        mockRole._id as string,
        'Updated Admin',
      );

      expect(result).toEqual(mockRole);
      expect(RoleType.findByIdAndUpdate).toHaveBeenCalledWith(
        mockRole._id,
        { type: 'Updated Admin' },
        { new: true, runValidators: true },
      );
      expect(RoleType.findByIdAndUpdate).toHaveBeenCalledTimes(1);
    });

    it('should return null if the role does not exist', async () => {
      const validNonexistentId = new mongoose.Types.ObjectId().toString();

      (RoleType.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

      const result = await updateRoleService(validNonexistentId, 'New Role');

      expect(result).toBeNull();
      expect(RoleType.findByIdAndUpdate).toHaveBeenCalledWith(
        validNonexistentId,
        { type: 'New Role' },
        { new: true, runValidators: true },
      );
      expect(RoleType.findByIdAndUpdate).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if an invalid ID format is provided', async () => {
      const invalidId = 'invalid_id_format';

      await expect(
        updateRoleService(invalidId, 'Invalid Role'),
      ).rejects.toThrow('Invalid ID format');
      expect(RoleType.findByIdAndUpdate).not.toHaveBeenCalled();
    });

    it('should throw an error if an unexpected error occurs', async () => {
      const errorMessage = 'Database connection error';
      const validId = new mongoose.Types.ObjectId().toString();

      (RoleType.findByIdAndUpdate as jest.Mock).mockRejectedValueOnce(
        new Error(errorMessage),
      );

      await expect(
        updateRoleService(validId, 'Role with Error'),
      ).rejects.toThrow(errorMessage);
      expect(RoleType.findByIdAndUpdate).toHaveBeenCalledWith(
        validId,
        { type: 'Role with Error' },
        { new: true, runValidators: true },
      );
      expect(RoleType.findByIdAndUpdate).toHaveBeenCalledTimes(1);
    });
  });
});
