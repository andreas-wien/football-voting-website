"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import LeaderboardButton from "@/components/LeaderboardButton";
import GlobalLeaderboard from "@/components/GlobalLeaderboard";
import CountryLeaderboard from "@/components/CountryLeaderboard";

export default function Leaderboard() {
  const [globalLeaderboard, setGlobalLeaderboard] = useState([]);
  const [countryLeaderboards, setCountryLeaderboards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/teams/leaderboard")
      .then((response) => {
        const { globalLeaderboard, leaderboard } = response.data;
        setGlobalLeaderboard(globalLeaderboard);
        setCountryLeaderboards(leaderboard);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching leaderboard:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading leaderboard...</p>;
  if (!Array.isArray(globalLeaderboard))
    return <p>Error: Global leaderboard data is not valid.</p>;

  return (
    <div className="max-w-4xl mx-auto text-center">
      <LeaderboardButton />

      <h1 className="text-3xl font-bold text-indigo-700 mb-6">
        🏆 Global Leaderboard
      </h1>

      <GlobalLeaderboard globalLeaderboard={globalLeaderboard} />

      {countryLeaderboards.map((countryLeaderboard) => (
        <CountryLeaderboard
          key={countryLeaderboard.country}
          countryLeaderboard={countryLeaderboard}
        />
      ))}

      <LeaderboardButton />
    </div>
  );
}
