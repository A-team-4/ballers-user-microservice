import { Document } from 'mongoose';

export interface IRoleType extends Document {
  name: string;
  type: string;
}
