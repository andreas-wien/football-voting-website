import Image from "next/image";

const TeamVoting = ({ team, handleVote, votedTeamId }) => {
  return (
    <div
      key={team.team_id}
      className="border-b py-4 flex flex-col items-center"
    >
      <Image src={team.logo} alt={team.name} width={50} height={50} />
      <h3 className="text-lg font-semibold text-gray-800">{team.name}</h3>
      <p className="text-gray-600">Votes: {team.votes}</p>
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
    </div>
  );
};

export default TeamVoting;
