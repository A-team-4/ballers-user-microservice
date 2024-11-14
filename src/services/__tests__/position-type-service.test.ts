import mongoose from 'mongoose';
import {
  createPositionTypeService,
  getAllPositionTypeService,
  getPostionTypeByIdService,
  deletePositionTypeService,
  updatePositionTypeService,
} from '../../services/position-type-service';
import { PositionType } from '../../models/position';
import { IPositionTypes } from '../../interfaces/position.interface';

jest.mock('../../models/position');

describe('PositionType Services', () => {
  // Test create position type service
  describe('createPositionTypeService', () => {
    const body = { name: 'Manager' };
    const expectedResult = { name: 'Manager', _id: 'aabbs', __v: 0 };

    it('should return created PositionType', async () => {
      (PositionType.create as jest.Mock).mockResolvedValueOnce(expectedResult);

      expect(await createPositionTypeService(body.name)).toStrictEqual(
        expectedResult,
      );
      expect(PositionType.create).toHaveBeenCalledWith({ name: body.name });
      expect(PositionType.create).toHaveBeenCalledTimes(1);
    });
  });

  // Test get all position types service
  describe('getAllPositionTypeService', () => {
    it('should return all position types', async () => {
      const mockPositionTypes = [
        { name: 'Manager' },
        { name: 'Developer' },
      ] as IPositionTypes[];

      (PositionType.find as jest.Mock).mockResolvedValue(mockPositionTypes);

      const result = await getAllPositionTypeService();

      expect(result).toEqual(mockPositionTypes);
      expect(PositionType.find).toHaveBeenCalledTimes(1);
    });
  });

  // Test get position type by ID service
  describe('getPostionTypeByIdService', () => {
    const mockPositionTypeId = 'aabbs';
    const mockPositionType = { _id: mockPositionTypeId, name: 'Manager' };

    it('should return the position type if found', async () => {
      (PositionType.findById as jest.Mock).mockResolvedValue(mockPositionType);

      const result = await getPostionTypeByIdService(mockPositionTypeId);
      expect(result).toEqual(mockPositionType);
      expect(PositionType.findById).toHaveBeenCalledWith(mockPositionTypeId);
      expect(PositionType.findById).toHaveBeenCalledTimes(1);
    });
  });

  // Test delete a position type service
  describe('deletePositionTypeService', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it('should delete a position type', async () => {
      const mockPositionTypeId = new mongoose.Types.ObjectId().toString();

      (PositionType.findByIdAndDelete as jest.Mock).mockResolvedValue(true);

      const response = await deletePositionTypeService(mockPositionTypeId);

      expect(response).toBeTruthy();

      expect(PositionType.findByIdAndDelete).toHaveBeenCalledWith(
        mockPositionTypeId,
      );
      expect(PositionType.findByIdAndDelete).toHaveBeenCalledTimes(1);
    });

    it('should return false if no data deleted', async () => {
      const mockPositionTypeId = new mongoose.Types.ObjectId().toString();

      (PositionType.findByIdAndDelete as jest.Mock).mockResolvedValue(false);

      const response = await deletePositionTypeService(mockPositionTypeId);

      expect(response).toBeFalsy();

      expect(PositionType.findByIdAndDelete).toHaveBeenCalledWith(
        mockPositionTypeId,
      );
      expect(PositionType.findByIdAndDelete).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if an invalid ID format is provided', async () => {
      const invalidId = 'invalid_id_format';

      await expect(deletePositionTypeService(invalidId)).rejects.toThrow(
        'Invalid ID format',
      );
      expect(PositionType.findByIdAndDelete).not.toHaveBeenCalled();
    });
  });

  // Test update a position type service
  describe('updatePositionTypeService', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should update and return the updated position type if the ID is valid', async () => {
      const mockPositionType: IPositionTypes = {
        _id: new mongoose.Types.ObjectId().toString(),
        name: 'Manager',
      } as IPositionTypes;

      (PositionType.findByIdAndUpdate as jest.Mock).mockResolvedValue(
        mockPositionType,
      );

      const result = await updatePositionTypeService(
        mockPositionType._id as string,
        'Updated Manager',
      );

      expect(result).toEqual(mockPositionType);
      expect(PositionType.findByIdAndUpdate).toHaveBeenCalledWith(
        mockPositionType._id,
        { name: 'Updated Manager' },
        { new: true, runValidators: true },
      );
      expect(PositionType.findByIdAndUpdate).toHaveBeenCalledTimes(1);
    });

    it('should return null if the position type does not exist', async () => {
      const validNonexistentId = new mongoose.Types.ObjectId().toString();

      (PositionType.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

      const result = await updatePositionTypeService(
        validNonexistentId,
        'New Position',
      );

      expect(result).toBeNull();
      expect(PositionType.findByIdAndUpdate).toHaveBeenCalledWith(
        validNonexistentId,
        { name: 'New Position' },
        { new: true, runValidators: true },
      );
      expect(PositionType.findByIdAndUpdate).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if an invalid ID format is provided', async () => {
      const invalidId = 'invalid_id_format';

      await expect(
        updatePositionTypeService(invalidId, 'Invalid Position'),
      ).rejects.toThrow('Invalid ID format');
      expect(PositionType.findByIdAndUpdate).not.toHaveBeenCalled();
    });

    it('should throw an error if an unexpected error occurs', async () => {
      const errorMessage = 'Database connection error';
      const validId = new mongoose.Types.ObjectId().toString();

      (PositionType.findByIdAndUpdate as jest.Mock).mockRejectedValueOnce(
        new Error(errorMessage),
      );

      await expect(
        updatePositionTypeService(validId, 'Position with Error'),
      ).rejects.toThrow(errorMessage);
      expect(PositionType.findByIdAndUpdate).toHaveBeenCalledWith(
        validId,
        { name: 'Position with Error' },
        { new: true, runValidators: true },
      );
      expect(PositionType.findByIdAndUpdate).toHaveBeenCalledTimes(1);
    });
  });
});
