// GET /api/teams/vote-status
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Vote from "@/models/Vote";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

export async function GET(req) {
  try {
    const session = await getServerSession({ authOptions });
    if (!session) {
      return NextResponse.json(
        { message: "You must be logged in to check vote status." },
        { status: 401 }
      );
    }

    const { email } = session.user;

    await connectDB();

    // Check if the user has voted and return the voted team ID
    const existingVote = await Vote.findOne({ userId: email });

    if (existingVote) {
      return NextResponse.json({ votedTeamId: existingVote.teamId });
    } else {
      return NextResponse.json({ votedTeamId: null });
    }
  } catch (error) {
    console.error("Error checking vote status:", error);
    return NextResponse.json(
      { message: "An error occurred while checking vote status." },
      { status: 500 }
    );
  }
}
