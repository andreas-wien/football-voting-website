"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

 
  useEffect(() => {
    axios
      .get("/api/teams/index")
      .then((response) => {
        if (Array.isArray(response.data)) {
          setTeams(response.data);
        } else {
          console.error("Invalid data format:", response.data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching teams:", error);
        setLoading(false);
      });
  }, []);

  const handleVote = async (teamId) => {
    if (!session) {
      alert("Please log in to vote.");
      return;
    }

    try {
      const response = await axios.post("/api/teams/vote", { team_id: teamId });

      // Find the team that the user has previously voted for (if any)
      const previousVote = teams.find((team) => team.hasVoted);

      // If there was a previous vote, decrement its vote count
      if (previousVote) {
        setTeams((prevTeams) =>
          prevTeams.map((team) =>
            team.team_id === previousVote.team_id
              ? { ...team, votes: team.votes - 1, hasVoted: false }
              : team
          )
        );
      }

      // Update the selected team's vote count and mark it as voted
      setTeams((prevTeams) =>
        prevTeams.map((team) =>
          team.team_id === teamId
            ? { ...team, votes: team.votes + 1, hasVoted: true }
            : team
        )
      );
    } catch (error) {
      alert(error.response?.data?.message || "Error voting!");
    }
  };

  // Display a loading state while data is being fetched
  if (loading) return <p>Loading teams...</p>;

  // Display an error if the teams data format is incorrect
  if (!Array.isArray(teams)) {
    return <p>Error: Teams data is not in the expected format.</p>;
  }

  return (
    <div className="max-w-lg mx-auto text-center">
      <h1 className="text-2xl font-bold">
        Vote for Your Favorite Football Team
      </h1>

      {/* Display login/logout buttons based on session state */}
      {status === "loading" ? (
        <p>Loading...</p>
      ) : !session ? (
        <button
          onClick={() => signIn("google")} // Trigger Google sign-in
          className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
        >
          Sign in with Google
        </button>
      ) : (
        <div>
          <p>Welcome, {session.user.name}</p>
          <button
            onClick={() => signOut()} // Sign out
            className="bg-red-500 text-white px-4 py-2 rounded mt-4"
          >
            Sign out
          </button>
        </div>
      )}

      {/* List teams and handle voting */}
      {teams.map((team) => (
        <div key={team.team_id} className="border-b py-4">
          <Image
            src={team.logo}
            alt={team.name}
            width={50}
            height={50}
            className="mx-auto"
          />
          <h3 className="text-lg font-semibold">{team.name}</h3>
          <p>Votes: {team.votes}</p>
          <button
            onClick={() => handleVote(team.team_id)}
            className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
            disabled={team.hasVoted} // Disable button if the user has voted
          >
            Vote
          </button>
        </div>
      ))}
    </div>
  );
}
