const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/User");

dotenv.config();

const users = [
  {
    fullName: "Admin User",
    email: "admin@example.com",
    password: "password123",
    gender: "Male",
    bloodGroup: "O+",
    phone: "01700000000",
    city: "Dhaka",
    district: "Dhaka",
    country: "Bangladesh",
    lastDonation: "",
    agreedToTerms: true,
    role: "admin",
    isAvailable: false,
  },
  {
    fullName: "Donor One",
    email: "donor1@example.com",
    password: "password123",
    gender: "Male",
    bloodGroup: "A+",
    phone: "01800000000",
    city: "Chittagong",
    district: "Chittagong",
    country: "Bangladesh",
    lastDonation: "2023-12-01",
    agreedToTerms: true,
    role: "donor",
    isAvailable: true,
  },
  {
    fullName: "Donor Two",
    email: "donor2@example.com",
    password: "password123",
    gender: "Female",
    bloodGroup: "B+",
    phone: "01900000000",
    city: "Dhaka",
    district: "Dhaka",
    country: "Bangladesh",
    lastDonation: "",
    agreedToTerms: true,
    role: "donor",
    isAvailable: true,
  },
  {
    fullName: "moderator One",
    email: "moderator1@example.com",
    password: "password123",
    gender: "Female",
    bloodGroup: "AB-",
    phone: "01600000000",
    city: "Sylhet",
    district: "Sylhet",
    country: "Bangladesh",
    lastDonation: "",
    agreedToTerms: true,
    role: "moderator",
    isAvailable: false,
  },
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // Clear existing users
    await User.deleteMany();

    // Create sample users
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
