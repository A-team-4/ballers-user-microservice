import mongoose, { Document } from 'mongoose';

export interface IState extends Document {
  name: string;
  countryId: mongoose.Types.ObjectId;
}
