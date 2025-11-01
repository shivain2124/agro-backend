import mongoose from 'mongoose';

const soilSampleSchema = new mongoose.Schema({
  timestamp: Date,
  latitude: Number,
  longitude: Number,
  N: Number,
  P: Number,
  K: Number,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  recommendation: {
    nutrients: [String],
    crops: [String]
  }
});

export default mongoose.model('SoilSample', soilSampleSchema);