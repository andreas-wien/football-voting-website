import mongoose from "mongoose";

const CountrySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  code: { type: String, required: true },
  flag: { type: String, required: true },
});

export default mongoose.models.Country ||
  mongoose.model("Country", CountrySchema);
