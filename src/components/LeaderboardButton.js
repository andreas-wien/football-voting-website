import Link from "next/link";

export default function LeaderboardButton() {
  return (
    <Link href="/">
      <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-full mt-6 transition-all">
        ← Back to Home
      </button>
    </Link>
  );
}
