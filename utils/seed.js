const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/User");

dotenv.config();

const users = [
  {
    name: "Admin User",
    email: "admin@example.com",
    password: "password123",
    role: "admin",
    bloodType: "O+",
    location: "Dhaka, Bangladesh",
    phone: "01700000000",
    isAvailable: false,
  },
  {
    name: "Donor One",
    email: "donor1@example.com",
    password: "password123",
    role: "donor",
    bloodType: "A+",
    location: "Chittagong, Bangladesh",
    phone: "01800000000",
    isAvailable: true,
  },
  {
    name: "Donor Two",
    email: "donor2@example.com",
    password: "password123",
    role: "donor",
    bloodType: "B+",
    location: "Dhaka, Bangladesh",
    phone: "01900000000",
    isAvailable: true,
  },
  {
    name: "Recipient One",
    email: "recipient1@example.com",
    password: "password123",
    role: "recipient",
    bloodType: "AB-",
    location: "Sylhet, Bangladesh",
    phone: "01600000000",
    isAvailable: false,
  },
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // Clear existing users
    await User.deleteMany();

    // Create sample users
    // Note: We use create instead of insertMany to trigger the password hashing middleware
    for (const user of users) {
      await User.create(user);
    }

    console.log("Data Seeded Successfully!");
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
