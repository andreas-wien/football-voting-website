import Image from "next/image";

export default function GlobalLeaderboard({ globalLeaderboard }) {
  return (
    <div>
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
    </div>
  );
}
