import mongoose from 'mongoose';
import { IRoleType } from '../interfaces/role.interface';
import { RoleType } from '../models/role';

export const createRoleService = async (
  type: string,
): Promise<Partial<IRoleType>> => {
  const roleInput: Partial<IRoleType> = { type };
  const roleCreated = await RoleType.create(roleInput);
  return roleCreated;
};

export const getAllRolesService = async (): Promise<IRoleType[]> => {
  const roles = await RoleType.find();
  return roles;
};

export const getRoleByIdService = async (
  id: string,
): Promise<IRoleType | null> => {
  const role = await RoleType.findById(id);
  return role;
};

export const deleteRoleService = async (id: string): Promise<boolean> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid ID format');
  }
  const deletedRole = await RoleType.findByIdAndDelete(id);
  if (!deletedRole) {
    return false;
  }
  return true;
};

export const updateRoleService = async (
  id: string,
  newType: string,
): Promise<IRoleType | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid ID format');
  }
  const updatedRole = await RoleType.findByIdAndUpdate(
    id,
    { type: newType },
    { new: true, runValidators: true },
  );
  return updatedRole;
};
