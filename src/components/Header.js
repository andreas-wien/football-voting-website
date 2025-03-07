import Link from "next/link";

const Header = () => {
  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold text-blue-700">
        Vote for Your Favorite Football Team
      </h1>

      <div className="mt-6">
        <Link
          href="/leaderboard/overall"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition-all"
        >
          View Leaderboard
        </Link>
      </div>
    </div>
  );
};

export default Header;
