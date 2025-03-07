"use client";

import { useState } from "react";
import useTeamsData from "@/hooks/useTeamsData";
import useSessionData from "@/hooks/useSessionData";
import useCountryToggle from "@/hooks/useCountryToggle";
import Header from "@/components/Header";
import Authentication from "@/components/Authentication";
import SearchBar from "@/components/SearchBar";
import TeamsByCountry from "@/components/TeamsByCountry";
import axios from "axios";

export default function Home() {
  const { session, votedTeamId, setVotedTeamId } = useSessionData();
  const { teams, loading, setTeams } = useTeamsData();
  const { expandedCountries, toggleCountry } = useCountryToggle();
  const [searchQuery, setSearchQuery] = useState("");

  const handleVote = async (teamId) => {
    if (!session) {
      alert("Please log in to vote.");
      return;
    }

    try {
      if (votedTeamId !== teamId) {
        if (votedTeamId) {
          await axios.post("/api/teams/vote", {
            team_id: votedTeamId,
            decrement: true,
          });
          setTeams((prevTeams) =>
            prevTeams.map((team) =>
              team.team_id === votedTeamId
                ? { ...team, votes: team.votes - 1 }
                : team
            )
          );
        }

        await axios.post("/api/teams/vote", { team_id: teamId });

        setTeams((prevTeams) =>
          prevTeams.map((team) =>
            team.team_id === teamId ? { ...team, votes: team.votes + 1 } : team
          )
        );

        setVotedTeamId(teamId);
      } else {
        alert("You have already voted for this team.");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Error voting!");
    }
  };

  if (loading) return <p>Loading teams...</p>;
  if (!Array.isArray(teams))
    return <p>Error: Teams data is not in the expected format.</p>;

  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const teamsByCountry = filteredTeams.reduce((acc, team) => {
    if (!acc[team.country]) acc[team.country] = [];
    acc[team.country].push(team);
    return acc;
  }, {});

  return (
    <div className="max-w-xl mx-auto">
      <Header />
      <Authentication />
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <div className="mt-6">
        {Object.entries(teamsByCountry).map(([country, teams]) => (
          <TeamsByCountry
            key={country}
            country={country}
            teams={teams}
            expandedCountries={expandedCountries}
            toggleCountry={toggleCountry}
            handleVote={handleVote}
            votedTeamId={votedTeamId}
          />
        ))}
      </div>
    </div>
  );
}
