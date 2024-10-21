import mongoose, { ConnectOptions } from 'mongoose';

const clientOptions = {
  serverApi: { version: '1', strict: true, deprecationErrors: true },
  serverSelectionTimeoutMS: 5000, // 5 seconds timeout for server selection
  socketTimeoutMS: 45000, // 45 seconds timeout for inactivity
  retryWrites: true, // Retry failed write operations
} as ConnectOptions;

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_URI!, clientOptions);
    console.log('MongoDb Connected');
  } catch (err) {
    console.error('Failed to connect to db', err);
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    await mongoose.disconnect();
    console.log('MongoDb Disconnected');
  } catch (err) {
    console.error('Failed to connect to db', err);
  }
};
