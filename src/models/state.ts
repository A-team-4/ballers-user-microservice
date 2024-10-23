import mongoose, { Schema } from 'mongoose';
import { IState } from '../interfaces/state.interface';
import validator from 'validator';

const StateSchema = new Schema<IState>(
  {
    name: {
      type: String,
      required: [true, 'state name is required'],
      trim: true,
      maxlength: [50, 'state name cannot be more than 50 characters'],
      set: (value: string) => validator.escape(value),
    },
    countryId: {
      type: Schema.Types.ObjectId,
      ref: 'Country',
    },
  },
  {
    timestamps: true,
  },
);

export const State = mongoose.model<IState>('State', StateSchema);
