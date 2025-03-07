"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import Link from "next/link";

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
      {/* Button to go back to Home */}
      <Link href="/">
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-full mt-6 transition-all">
          ← Back to Home
        </button>
      </Link>
      <h1 className="text-3xl font-bold text-indigo-700 mb-6">
        🏆 Global Leaderboard
      </h1>
      {/* Global Leaderboard (Top 10 only) */}
      <h2 className="text-2xl font-semibold text-indigo-600 mb-4">Global</h2>
      <div className="p-4 bg-blue-100 rounded-lg shadow-lg mb-8">
        <ul className="mt-3 space-y-4">
          {globalLeaderboard.map((team) => (
            <li
              key={team.team_id}
              className="flex justify-between py-3 px-4 border-b bg-white rounded-lg shadow-sm"
            >
              <div className="flex items-center gap-3">
                <span className="font-semibold text-indigo-700">
                  {team.rank}.
                </span>
                <Image src={team.logo} alt={team.name} width={30} height={30} />
                <span className="font-semibold text-gray-800">{team.name}</span>
              </div>
              <span className="text-gray-700">🔥 {team.votes} votes</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Country Leaderboards (Top 10 per country) */}
      {countryLeaderboards.map((countryLeaderboard) => (
        <div key={countryLeaderboard.country} className="mb-6">
          <h2 className="text-2xl font-semibold text-indigo-600 mb-4">
            {countryLeaderboard.country}
          </h2>
          <div className="p-4 bg-blue-100 rounded-lg shadow-lg">
            <ul className="mt-3 space-y-4">
              {countryLeaderboard.teams.map((team) => (
                <li
                  key={team.team_id}
                  className="flex justify-between py-3 px-4 border-b bg-white rounded-lg shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-indigo-700">
                      {team.rank}.
                    </span>
                    <Image
                      src={team.logo}
                      alt={team.name}
                      width={30}
                      height={30}
                    />
                    <span className="font-semibold text-gray-800">
                      {team.name}
                    </span>
                  </div>
                  <span className="text-gray-700">🔥 {team.votes} votes</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}

      {/* Button to go back to Home */}
      <Link href="/">
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-full mt-6 transition-all">
          ← Back to Home
        </button>
      </Link>
    </div>
  );
}
