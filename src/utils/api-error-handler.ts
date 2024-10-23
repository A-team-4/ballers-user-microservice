/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response } from 'express';
import mongoose from 'mongoose';
import {
  INTERNAL_SERVER_ERROR,
  MONGO_SERVER_ERROR,
} from '../constants/contants';

export function apiErrorHandler(err: any, res: Response) {
  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({
      message: err.errors,
    });
  } else if (err.name === MONGO_SERVER_ERROR && err.code === 11000) {
    return res.status(400).json({
      message: `${Object.keys(err.keyValue).join(', ')} already exists`,
    });
  } else {
    return res.status(500).json({
      message: `${INTERNAL_SERVER_ERROR}: ${err.message}`,
    });
  }
}
