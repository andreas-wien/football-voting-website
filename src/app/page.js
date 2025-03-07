"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link"; // Import the Link component

export default function Home() {
  const { data: session, status } = useSession();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCountries, setExpandedCountries] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState(""); // State for search input
  const [votedTeamId, setVotedTeamId] = useState(null); // Track the team the user voted for

  useEffect(() => {
    // Fetch teams when session changes or at the first load
    setLoading(true); // Ensure loading state is true while fetching

    // Fetch the teams
    axios
      .get("/api/teams/index")
      .then((response) => {
        if (Array.isArray(response.data)) {
          setTeams(response.data);
        } else {
          console.error("Invalid data format:", response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching teams:", error);
      });

    // If logged in, fetch the user's vote status
    if (session) {
      axios
        .get("/api/teams/vote-status")
        .then((voteResponse) => {
          setVotedTeamId(voteResponse.data.votedTeamId); // Set the team the user has voted for
        })
        .catch((error) => {
          console.error("Error fetching vote status:", error);
        })
        .finally(() => {
          setLoading(false); // Ensure loading state is false after fetching completes
        });
    } else {
      setLoading(false); // Ensure loading state is false when session is not available
    }
  }, [session]); // Dependency on session

  const handleVote = async (teamId) => {
    if (!session) {
      alert("Please log in to vote.");
      return;
    }

    try {
      // If the user is voting for a new team (not the team they already voted for)
      if (votedTeamId !== teamId) {
        // First, decrease the vote for the team they previously voted for
        if (votedTeamId) {
          await axios.post("/api/teams/vote", {
            team_id: votedTeamId,
            decrement: true,
          });

          // Update the UI to reflect the decremented vote count for the previous team
          setTeams((prevTeams) =>
            prevTeams.map((team) =>
              team.team_id === votedTeamId
                ? { ...team, votes: team.votes - 1 }
                : team
            )
          );
        }

        // Now, increment the vote for the new team
        await axios.post("/api/teams/vote", { team_id: teamId });

        // Update the UI to reflect the incremented vote count for the new team
        setTeams((prevTeams) =>
          prevTeams.map((team) =>
            team.team_id === teamId ? { ...team, votes: team.votes + 1 } : team
          )
        );

        // Set the new team as the user's voted team
        setVotedTeamId(teamId);
      } else {
        alert("You have already voted for this team.");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Error voting!");
    }
  };

  const toggleCountry = (country) => {
    setExpandedCountries((prevExpanded) => {
      const newExpanded = new Set(prevExpanded);
      if (newExpanded.has(country)) {
        newExpanded.delete(country);
      } else {
        newExpanded.add(country);
      }
      return newExpanded;
    });
  };

  if (loading) return <p>Loading teams...</p>;
  if (!Array.isArray(teams))
    return <p>Error: Teams data is not in the expected format.</p>;

  // Filter teams based on search query
  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group filtered teams by country
  const teamsByCountry = filteredTeams.reduce((acc, team) => {
    if (!acc[team.country]) acc[team.country] = [];
    acc[team.country].push(team);
    return acc;
  }, {});

  return (
    <div className="max-w-xl mx-auto text-center">
      <h1 className="text-3xl font-bold text-blue-700">
        Vote for Your Favorite Football Team
      </h1>

      {/* Link to the leaderboard page */}
      <div className="mt-6">
        <Link
          href="/leaderboard/overall" // Path to the leaderboard page
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition-all"
        >
          View Leaderboard
        </Link>
      </div>

      {/* Authentication */}
      {status === "loading" ? (
        <p>Loading...</p>
      ) : !session ? (
        <button
          onClick={() => signIn("google")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full mt-4 transition-all"
        >
          Sign in with Google
        </button>
      ) : (
        <div className="mt-4">
          <p className="text-gray-700 font-semibold">
            Welcome, {session.user.name}
          </p>
          <button
            onClick={() => signOut()}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full mt-3 transition-all"
          >
            Sign out
          </button>
        </div>
      )}

      {/* Search Bar */}
      <div className="mt-6 mb-4">
        <input
          type="text"
          placeholder="Search for a team..."
          className="px-4 py-2 border rounded-full w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Grouped Filtered Teams by Country */}
      <div className="mt-6">
        {Object.entries(teamsByCountry).map(([country, teams]) => (
          <div
            key={country}
            className="mb-4 border rounded-lg overflow-hidden shadow-md"
          >
            {/* Country Header (Clickable) */}
            <button
              onClick={() => toggleCountry(country)}
              className="w-full text-left px-5 py-3 bg-blue-700 text-white font-semibold flex justify-between items-center"
            >
              {country}
              <span>{expandedCountries.has(country) ? "▲" : "▼"}</span>
            </button>

            {/* Teams List (Collapsible) */}
            {expandedCountries.has(country) && (
              <div className="p-4 bg-gray-100">
                {teams.map((team) => (
                  <div
                    key={team.team_id}
                    className="border-b py-4 flex flex-col items-center"
                  >
                    <Image
                      src={team.logo}
                      alt={team.name}
                      width={50}
                      height={50}
                    />
                    <h3 className="text-lg font-semibold text-gray-800">
                      {team.name}
                    </h3>
                    <p className="text-gray-600">Votes: {team.votes}</p>
                    {session && (
                      <button
                        onClick={() => handleVote(team.team_id)}
                        className={`px-5 py-2 rounded-full mt-2 transition-all ${
                          votedTeamId === team.team_id
                            ? "bg-gray-400 text-white cursor-not-allowed"
                            : "bg-blue-500 hover:bg-blue-600 text-white"
                        }`}
                        disabled={votedTeamId === team.team_id}
                      >
                        {votedTeamId === team.team_id ? "Voted" : "Vote"}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
