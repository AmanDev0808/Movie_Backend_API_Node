const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const User = require('./model/user.model');

const run = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    const email = 'admin@cineverse.com';
    const password = 'Admin@123';

    const existing = await User.findOne({ email });
    if (existing) {
      console.log('Admin user already exists:', email);
      console.log('Password:', password);
      process.exit(0);
    }

    const user = await User.create({
      name: 'System Admin',
      email,
      password: bcrypt.hashSync(password, 8),
      userType: 'ADMIN',
      userStatus: 'APPROVED'
    });

    console.log('Admin account created successfully');
    console.log('Email:', user.email);
    console.log('Password:', password);
    process.exit(0);
  } catch (error) {
    console.error('Failed to create admin:', error.message);
    process.exit(1);
  }
};

run();
