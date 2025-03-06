import mongoose from "mongoose";

const voteSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    teamId: {
      type: Number,
      required: true,
    },
    votedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Vote || mongoose.model("Vote", voteSchema);
