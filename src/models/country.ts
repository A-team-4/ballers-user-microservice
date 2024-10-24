import mongoose, { Schema } from 'mongoose';
import { ICountry } from '../interfaces/country.interface';
import validator from 'validator';

const CountrySchema = new Schema<ICountry>({
  name: {
    type: String,
    required: [true, 'Country name is required'],
    unique: true,
    trim: true,
    set: (value: string) => validator.escape(value),
  },
});

export const Country = mongoose.model<ICountry>('Country', CountrySchema);
