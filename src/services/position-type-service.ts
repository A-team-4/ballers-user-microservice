import mongoose from 'mongoose';
import { IPositionTypes } from '../interfaces/position.interface';
import { PositionType } from '../models/position';

export const createPositionTypeService = async (
  name: string,
): Promise<Partial<IPositionTypes>> => {
  const positionTypeInput: Partial<IPositionTypes> = { name };
  const positionTypeCreated = await PositionType.create(positionTypeInput);
  return positionTypeCreated;
};

export const getAllPositionTypeService = async (): Promise<
  IPositionTypes[]
> => {
  const postionTypes = await PositionType.find();
  return postionTypes;
};

export const getPostionTypeByIdService = async (
  id: string,
): Promise<IPositionTypes | null> => {
  const postionType = await PositionType.findById(id);
  return postionType;
};

export const deletePositionTypeService = async (
  id: string,
): Promise<boolean> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid ID format');
  }

  const deletedPositionType = await PositionType.findByIdAndDelete(id);
  if (!deletedPositionType) {
    return false;
  }
  return true;
};

export const updatePositionTypeService = async (
  id: string,
  newName: string,
): Promise<IPositionTypes | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid ID format');
  }
  const updatedPositionType = await PositionType.findByIdAndUpdate(
    id,
    { name: newName },
    { new: true, runValidators: true },
  );
  return updatedPositionType;
};
