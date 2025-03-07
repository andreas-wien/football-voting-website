import TeamVoting from "./TeamVoting";

const TeamsByCountry = ({
  country,
  teams,
  expandedCountries,
  toggleCountry,
  handleVote,
  votedTeamId,
}) => {
  return (
    <div className="mb-4 border rounded-lg overflow-hidden shadow-md">
      <button
        onClick={() => toggleCountry(country)}
        className="w-full text-left px-5 py-3 bg-blue-700 text-white font-semibold flex justify-between items-center"
      >
        {country}
        <span>{expandedCountries.has(country) ? "▲" : "▼"}</span>
      </button>

      {expandedCountries.has(country) && (
        <div className="p-4 bg-gray-100">
          {teams.map((team) => (
            <TeamVoting
              key={team.team_id}
              team={team}
              handleVote={handleVote}
              votedTeamId={votedTeamId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamsByCountry;
