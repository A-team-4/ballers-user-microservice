import mongoose, { Schema } from 'mongoose';
import { IRoleType } from '../interfaces/role.interface';

const RoleTypeSchema = new Schema<IRoleType>({
  type: {
    type: String,
    required: [true, 'Role type is required'],
    trime: true,
  },
});

export const RoleType = mongoose.model<IRoleType>('RoleType', RoleTypeSchema);
