import mongoose, { Schema } from 'mongoose';
import { ICountry } from '../interfaces/country.interface';

const CountrySchema = new Schema<ICountry>({
  name: {
    type: String,
    required: [true, 'Country name is required'],
    trim: true,
  },
});

export const Country = mongoose.model<ICountry>('Country', CountrySchema);
