import { Document } from 'mongoose';

export interface ILocation extends Document {
  lat: number;
  lon: number;
}
