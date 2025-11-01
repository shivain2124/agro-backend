import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Crop from './models/Crop.js';

dotenv.config();

const sampleCrops = [
  {
    crop: "Wheat",
    N_min: 20,
    N_max: 40,
    P_min: 15,
    P_max: 30,
    K_min: 10,
    K_max: 25
  },
  {
    crop: "Rice",
    N_min: 15,
    N_max: 35,
    P_min: 10,
    P_max: 25,
    K_min: 20,
    K_max: 40
  },
  {
    crop: "Maize",
    N_min: 30,
    N_max: 60,
    P_min: 25,
    P_max: 45,
    K_min: 20,
    K_max: 50
  },
  {
    crop: "Potato",
    N_min: 40,
    N_max: 70,
    P_min: 30,
    P_max: 60,
    K_min: 40,
    K_max: 90
  },
  {
    crop: "Groundnut",
    N_min: 20,
    N_max: 30,
    P_min: 25,
    P_max: 40,
    K_min: 30,
    K_max: 45
  },
  {
    crop: "Tomato",
    N_min: 30,
    N_max: 50,
    P_min: 20,
    P_max: 35,
    K_min: 25,
    K_max: 45
  },
  {
    crop: "Onion",
    N_min: 40,
    N_max: 60,
    P_min: 30,
    P_max: 45,
    K_min: 35,
    K_max: 60
  }
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    await Crop.deleteMany({});
    await Crop.insertMany(sampleCrops);
    console.log('✅ Crop database seeded successfully!');
    process.exit();
  })
  .catch(err => {
    console.error('❌ Failed to seed crop data:', err);
    process.exit(1);
  });