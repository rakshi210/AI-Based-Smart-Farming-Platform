import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI;

  if (!uri || uri.includes('your_mongodb_atlas_connection_string')) {
    console.error('\n============================================================');
    console.error('❌ MONGODB CONFIGURATION ERROR');
    console.error('MongoDB connection failed. Please check MONGODB_URI and MongoDB Atlas Network Access.');
    console.error('Please configure a valid MongoDB Atlas connection string in backend/.env');
    console.error('Format: MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority');
    console.error('============================================================\n');
    throw new Error('MongoDB connection failed. Please check MONGODB_URI and MongoDB Atlas Network Access.');
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`\n✅ MongoDB connected successfully: ${conn.connection.host}`);
    console.log(`🗄️ Database Name: ${conn.connection.name}\n`);
  } catch (error: any) {
    console.error('\n============================================================');
    console.error('❌ MONGODB CONNECTION FAILED');
    console.error('MongoDB connection failed. Please check MONGODB_URI and MongoDB Atlas Network Access.');
    console.error(`Error details: ${error.message || error}`);
    console.error('Ensure your IP address is whitelisted in MongoDB Atlas (Network Access -> Add IP Address: 0.0.0.0/0 for testing).');
    console.error('============================================================\n');
    throw error;
  }
};

