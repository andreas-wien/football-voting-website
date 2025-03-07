import axios from "axios";
import connectDB from "../lib/db.js";
import Team from "../models/Team.js";
import "dotenv/config.js";

const country = "Austria";

async function fetchTeams() {
  const response = await axios.get(`${process.env.FOOTBALL_API_URL}/teams`, {
    headers: {
      "x-apisports-key": process.env.FOOTBALL_API_KEY,
    },
    params: { country },
  });

  const teams = response.data.response;

  await connectDB();

  for (const team of teams) {
    const { id, name, logo, country } = team.team;

    await Team.findOneAndUpdate(
      { team_id: id },
      {
        $set: { name, logo, country },
        $setOnInsert: { votes: 0 },
      },
      { upsert: true, new: true }
    );
  }
}

export default fetchTeams;
