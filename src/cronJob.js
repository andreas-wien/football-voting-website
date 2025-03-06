import axios from "axios";
import connectDB from "./lib/db.js";
import Team from "./models/Team.js";
import cron from "node-cron";

const API_URL = "https://v3.football.api-sports.io";
const API_KEY = process.env.FOOTBALL_API_KEY;
const country = "Austria";

let cronJobRunning = false;

// Fetch teams from the public API
const fetchTeams = async () => {
  if (cronJobRunning) return;

  cronJobRunning = true;
  try {
    const response = await axios.get(`${API_URL}/teams`, {
      headers: {
        "x-apisports-key": API_KEY,
      },
      params: { country },
    });

    const teams = response.data.response;
    await connectDB();

    for (const team of teams) {
      const { id, name, logo, country } = team.team;

      const updatedTeam = await Team.findOneAndUpdate(
        { team_id: id },
        { $set: { name, logo, country, votes: 0 } },
        { upsert: true, new: true } // If the team doesn't exist, create it, and return the updated team
      );
    }

    console.log("Teams have been updated in MongoDB.");
  } catch (error) {
    console.error("Error fetching and saving teams:", error);
  } finally {
    cronJobRunning = false;
  }
};

cron.schedule("0 0 * * *", fetchTeams); // Runs every day at midnight

console.log("Cron job for fetching teams is set.");

export default fetchTeams;
