import mongoose from "mongoose";

const TeamSchema = new mongoose.Schema({
  team_id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  logo: { type: String },
  country: { type: String },
  votes: { type: Number, default: 0 },
});

export default mongoose.models.Team || mongoose.model("Team", TeamSchema);
