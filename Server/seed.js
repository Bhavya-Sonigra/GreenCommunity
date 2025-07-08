import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.model.js';

const seedTempUser = async () => {
  await mongoose.connect(process.env.MONGO_URI, { dbName: 'auth-db' });

  const hashed = await bcrypt.hash('temp123', 10);
  const user = await User.create({
    name: 'Temp User',
    email: 'temp@green.com',
    password: hashed
  });

  console.log('✅ Temp user created:', user);
  process.exit();
};

seedTempUser();