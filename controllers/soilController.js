import SoilSample from "../models/SoilSample.js";
import Crop from "../models/Crop.js";

export const submitSoilData = async (req, res) => {
  const { timestamp, latitude, longitude, N, P, K } = req.body;

  const crops = await Crop.find({});
  const recommendedCrops = crops
    .filter(
      (crop) =>
        N >= crop.N_min &&
        N <= crop.N_max &&
        P >= crop.P_min &&
        P <= crop.P_max &&
        K >= crop.K_min &&
        K <= crop.K_max
    )
    .map((c) => c.crop);

  const nutrientDeficiency = [];
  if (N < 20) nutrientDeficiency.push("Nitrogen");
  if (P < 10) nutrientDeficiency.push("Phosphorus");
  if (K < 15) nutrientDeficiency.push("Potassium");

  const sample = new SoilSample({
    timestamp,
    latitude,
    longitude,
    N,
    P,
    K,
    user: req.userId,
    recommendation: {
      nutrients: nutrientDeficiency,
      crops: recommendedCrops,
    },
  });

  await sample.save();
  res.json(sample);
};

export const getAllSoilSamples = async (req, res) => {
  try {
    const samples = await SoilSample.find({ user: req.userId }).sort({
      timestamp: -1,
    });
    res.json(samples);
  } catch (error) {
    res.status(500).json({ message: "Error fetching soil samples" });
  }
};
