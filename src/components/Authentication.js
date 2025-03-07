import { useSession, signIn, signOut } from "next-auth/react";

const Authentication = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return !session ? (
    <div className="text-center">
      <button
        onClick={() => signIn("google")}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full mt-4 transition-all"
      >
        Sign in with Google
      </button>
    </div>
  ) : (
    <div className="mt-4 text-center">
      <p className="text-gray-200 font-semibold">
        Welcome, {session.user.name}
      </p>
      <button
        onClick={() => signOut()}
        className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full mt-3 transition-all"
      >
        Sign out
      </button>
    </div>
  );
};

export default Authentication;
