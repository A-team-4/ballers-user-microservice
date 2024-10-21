import mongoose, { Document } from 'mongoose';
import { ILocation } from './location.interface';

export interface IUser extends Document {
  name: string;
  nickname: string;
  location: ILocation;
  positionTypeId: mongoose.Types.ObjectId;
  email: string;
  password: string;
  verified: boolean;
  bio: string;
  roleTypeId: mongoose.Types.ObjectId;
  city: string;
  state: string;
  country: string;
}
