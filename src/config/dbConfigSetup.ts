import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config({ path: '.env'});

if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI environment variable is required')
}

export const MONGO_URI: string = process.env.MONGO_URI;
