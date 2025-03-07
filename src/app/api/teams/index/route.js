import connectDB from "@/lib/db";
import Team from "@/models/Team";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    // Fetch all teams sorted by votes
    const teams = await Team.find().sort({ votes: -1 });

    if (teams.length === 0) {
      return NextResponse.json({ message: "No teams found" }, { status: 404 });
    }

    return NextResponse.json(teams);
  } catch (error) {
    console.error("Error fetching teams:", error);
    return NextResponse.json({ error: "Error fetching teams" }, { status: 500 });
  }
}
