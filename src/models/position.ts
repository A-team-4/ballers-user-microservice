import mongoose, { Schema } from 'mongoose';
import { IPositionTypes } from '../interfaces/position.interface';
import validator from 'validator';

const PositionTypeSchema = new Schema<IPositionTypes>({
  name: {
    type: String,
    required: [true, 'Position name is required'],
    trim: true,
    set: (value: string) => validator.escape(value),
  },
});

export const PositionType = mongoose.model<IPositionTypes>(
  'PositionType',
  PositionTypeSchema,
);
