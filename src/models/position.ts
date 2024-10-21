import mongoose, { Schema } from 'mongoose';
import { IPositionTypes } from '../interfaces/position.interface';

const PositionTypeSchema = new Schema<IPositionTypes>({
  name: {
    type: String,
    required: [true, 'Position name is required'],
    trim: true,
  },
});

export const PositionType = mongoose.model<IPositionTypes>('PositionType',PositionTypeSchema);
