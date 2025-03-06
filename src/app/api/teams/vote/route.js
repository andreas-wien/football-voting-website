import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Team from "@/models/Team";
import Vote from "@/models/Vote";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

export async function POST(req) {
  try {
    const session = await getServerSession({ authOptions });
    if (!session) {
      return NextResponse.json(
        { message: "You must be logged in to vote." },
        { status: 401 }
      );
    }

    const { email } = session.user;
    const { team_id } = await req.json();
    
    await connectDB();

    // Check if the user has already voted (check Vote collection, not per team)
    const existingVote = await Vote.findOne({ userId: email });
    if (existingVote) {
      await Team.findOneAndUpdate(
        { team_id: existingVote.teamId },
        {
          $inc: { votes: -1 },
        }
      );
      await Vote.deleteOne({ userId: email });
    }

    // If not voted, increment the vote count in the Team model
    await Team.findOneAndUpdate(
      { team_id },
      {
        $inc: { votes: 1 },
      },
      { new: true }
    );

    // Store the user's vote in the Vote collection
    const newVote = new Vote({
      userId: email,
      teamId: team_id,
    });

    await newVote.save();

    return NextResponse.json(
      { message: "Vote recorded successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error handling vote:", error);
    return NextResponse.json(
      { message: "An error occurred while processing your vote." },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
}
