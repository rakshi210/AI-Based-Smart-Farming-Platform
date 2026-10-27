import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function runTest() {
  const uri = process.env.MONGODB_URI;
  console.log('Testing MongoDB connection...');
  console.log(`URI provided: ${uri ? uri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@') : 'NONE'}`);

  if (!uri || uri.includes('your_mongodb_atlas_connection_string')) {
    console.error('❌ MONGODB_URI is not configured in backend/.env');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('✅ MongoDB connected successfully!');
    console.log(`Database name: ${mongoose.connection.name}`);
    console.log(`Host: ${mongoose.connection.host}`);
    await mongoose.disconnect();
    console.log('Disconnected cleanly.');
  } catch (err: any) {
    console.error('❌ MongoDB connection failed. Please check MONGODB_URI and MongoDB Atlas Network Access.');
    console.error('Error detail:', err.message);
    process.exit(1);
  }
}

runTest();

