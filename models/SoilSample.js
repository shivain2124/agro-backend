import mongoose from 'mongoose';

const SoilSampleSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  N: { type: Number, required: true },
  P: { type: Number, required: true },
  K: { type: Number, required: true },
  ph: { type: Number, required: false },
  moisture: { type: Number, required: false },
  latitude: { type: Number, required: false },
  longitude: { type: Number, required: false },
  timestamp: { type: Date, default: Date.now },
  recommendation: {
    nutrients: [String],
    crops: [String]
  }
});

export default mongoose.model('SoilSample', SoilSampleSchema);