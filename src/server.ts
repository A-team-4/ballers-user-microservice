import * as dotenv from 'dotenv';
import { connectDB, disconnectDB } from './config/dbConfig';
import app from './app';

dotenv.config({ path: '.env' });
const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  await connectDB();
  console.log(`Listening on PORT: ${PORT}`);
});

// Gracefully close the connection on process termination
process.on('SIGINT', async () => {
  await disconnectDB();
  console.log('MongoDB connection closed');
  process.exit(0);
});
