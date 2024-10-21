import { Document } from 'mongoose';

export interface IRoleType extends Document {
  type: string;
}
