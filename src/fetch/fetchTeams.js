import axios from "axios";
import connectDB from "../lib/db.js";
import Team from "../models/Team.js";
import Country from "../models/Country.js";
import "dotenv/config.js";

const MAX_COUNTRIES_PER_DAY = 80;

async function fetchTeams() {
  console.log("Fetching teams...");
  await connectDB();

  const countries = await Country.find({ hasBeenProcessed: false }).limit(
    MAX_COUNTRIES_PER_DAY
  );

  console.log(countries);

  for (const countryObj of countries) {
    const countryName = countryObj.name;

    try {
      const response = await axios.get(
        `${process.env.FOOTBALL_API_URL}/teams`,
        {
          headers: {
            "x-apisports-key": process.env.FOOTBALL_API_KEY,
          },
          params: { country: countryName },
        }
      );

      const teams = response.data.response;
      console.log(teams);

      for (const team of teams) {
        console.log(team);
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

      await Country.updateOne(
        { _id: countryObj._id },
        { $set: { hasBeenProcessed: true } }
      );

      console.log(`Processed teams for ${countryName}`);
    } catch (error) {
      console.error(`Failed to fetch teams for ${countryName}:`, error.message);
    }
  }
  console.log("Teams have been fetched and saved in MongoDB.");
}

export default fetchTeams;
