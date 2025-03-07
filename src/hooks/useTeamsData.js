import { useState, useEffect } from "react";
import axios from "axios";

const useTeamsData = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    axios
      .get("/api/teams/index")
      .then((response) => {
        if (Array.isArray(response.data)) {
          setTeams(response.data);
        } else {
          console.error("Invalid data format:", response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching teams:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { teams, loading, setTeams };
};

export default useTeamsData;
