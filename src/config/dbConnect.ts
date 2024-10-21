import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log('MongoDb Connected');
  } catch (err) {
    console.error('Failed to connect to db', err);
  }
};
