import mongoose from 'mongoose';

const cropSchema = new mongoose.Schema({
  crop: String,
  N_min: Number,
  N_max: Number,
  P_min: Number,
  P_max: Number,
  K_min: Number,
  K_max: Number
});

export default mongoose.model('Crop', cropSchema);