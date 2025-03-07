import axios from "axios";
import connectDB from "../lib/db.js";
import Country from "../models/Country.js";
import dotenv from "dotenv";

dotenv.config();

async function fetchCountries() {
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
    const { name, code, flag } = country.country;

    const updatedCountry = await Country.findOneAndUpdate(
      { name: name },
      { $set: { code, flag, hasBeenProcessed: false } },
      { upsert: true, new: true }
    );
  }
}

export default fetchCountries;
