import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import axios from "axios";

const useSessionData = () => {
  const { data: session } = useSession();
  const [votedTeamId, setVotedTeamId] = useState(null);

  useEffect(() => {
    if (session) {
      axios
        .get("/api/teams/vote-status")
        .then((voteResponse) => {
          setVotedTeamId(voteResponse.data.votedTeamId);
        })
        .catch((error) => {
          console.error("Error fetching vote status:", error);
        });
    }
  }, [session]);

  return { session, votedTeamId, setVotedTeamId };
};

export default useSessionData;
