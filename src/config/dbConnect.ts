import mongoose from 'mongoose';
import { MONGO_URI } from './dbConfigSetup';

// const dburl: string = process.env.MONGO_URI as string

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDb Connected');
  } catch (err) {
    console.error('Failed to connect to db', err);
  }
};
