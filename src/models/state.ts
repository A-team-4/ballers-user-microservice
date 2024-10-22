import mongoose, { Schema } from 'mongoose';
import { IState } from '../interfaces/state.interface';

const StateSchema = new Schema<IState>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters'],
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
