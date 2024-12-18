/* eslint no-useless-escape: "off" */
import mongoose, { Schema } from 'mongoose';
import { IUser } from '../interfaces/user.interface';
import validator, { isEmail } from 'validator';

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters'],
      set: (value: string) => validator.escape(value),
    },
    nickname: {
      type: String,
      trim: true,
      set: (value: string) => validator.escape(value),
    },
    location: {
      lat: {
        type: Number,
        required: [true, 'Latitude is required'],
      },
      lon: {
        type: Number,
        required: [true, 'Longitude is required'],
      },
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      validate: [isEmail, 'Please enter a valid email'],
      set: (value: string) => validator.escape(value),
    },
    positionTypeId: {
      type: Schema.Types.ObjectId,
      ref: 'PositionType',
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters long'],
      set: (value: string) => validator.escape(value),
    },
    verified: {
      type: Boolean,
      default: false,
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [100, 'Bio cannot be more than 100 characters'],
      set: (value: string) => validator.escape(value),
    },
    roleTypeId: {
      type: Schema.Types.ObjectId,
      ref: 'RoleType',
    },
    stateId: {
      type: Schema.Types.ObjectId,
      ref: 'State',
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

export const User = mongoose.model<IUser>('User', UserSchema);
