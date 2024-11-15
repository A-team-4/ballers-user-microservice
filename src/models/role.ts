import mongoose, { Schema } from 'mongoose';
import { IRoleType } from '../interfaces/role.interface';
import validator from 'validator';

const RoleTypeSchema = new Schema<IRoleType>({
  type: {
    type: String,
    required: [true, 'Role type is required'],
    trim: true,
    unique: true,
    set: (value: string) => validator.escape(value),
  },
});

export const RoleType = mongoose.model<IRoleType>('RoleType', RoleTypeSchema);
