import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Team from "@/models/Team";

export async function GET() {
  try {
    await connectDB();

    // Get all teams, sorted by votes in descending order, and limit to the top 10
    const teams = await Team.find().sort({ votes: -1 }).limit(10);

    // Group teams by country
    const leaderboardByCountry = await Team.aggregate([
      { $sort: { votes: -1 } },  // Sort teams by votes in descending order
      { $group: { _id: "$country", teams: { $push: "$$ROOT" } } }, // Group by country
    ]);

    // Create a global leaderboard (only top 10 teams)
    const globalLeaderboard = teams.map((team, index) => ({
      ...team.toObject(),
      rank: index + 1,  // Add the rank to each team
    }));

    // Limit each country leaderboard to the top 10 teams
    const leaderboard = leaderboardByCountry.map((countryLeaderboard) => ({
      country: countryLeaderboard._id,
      teams: countryLeaderboard.teams
        .slice(0, 10) // Limit to top 10
        .map((team, index) => ({
          ...team,
          rank: index + 1,  // Add the rank to each team
        })),
    }));

    return NextResponse.json({ globalLeaderboard, leaderboard }, { status: 200 });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching the leaderboard." },
      { status: 500 }
    );
  }
}
