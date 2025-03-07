import axios from "axios";
import connectDB from "../lib/db.js";
import Country from "../models/Country.js";
import "dotenv/config.js";

async function fetchCountries() {
    console.log("Fetching countries...");
  const response = await axios.get(
    `${process.env.FOOTBALL_API_URL}/teams/countries`,
    {
      headers: {
        "x-apisports-key": process.env.FOOTBALL_API_KEY,
      },
    }
  );

  const countries = response.data.response;
  await connectDB();

  for (const country of countries) {
    const { name, code, flag } = country;

    const updatedCountry = await Country.findOneAndUpdate(
      { name: name },
      { $set: { code, flag, hasBeenProcessed: false } },
      { upsert: true, new: true }
    );
  }
  console.log("Countries have been fetched and saved in MongoDB.");
}

export default fetchCountries;
