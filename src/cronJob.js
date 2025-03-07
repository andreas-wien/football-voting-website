import cron from "node-cron";
import fetchTeams from "./fetch/fetchTeams.js";
import fetchCountries from "./fetch/fetchCountries.js";

let cronJobTeamsRunning = false;
const fetchTeamsCronJob = async () => {
  if (cronJobTeamsRunning) return;
  cronJobTeamsRunning = true;
  try {
    await fetchTeams();
    console.log("Teams have been updated in MongoDB.");
  } catch (error) {
    console.error("Error fetching and saving teams:", error);
  } finally {
    cronJobTeamsRunning = false;
  }
};

let cronJobCountriesRunning = false;
const fetchCountriesCronJob = async () => {
  if (cronJobCountriesRunning) return;
  cronJobCountriesRunning = true;
  try {
    await fetchCountries();
    console.log("Countries have been updated in MongoDB.");
  } catch (error) {
    console.error("Error fetching and saving counties:", error);
  } finally {
    cronJobCountriesRunning = false;
  }
};

cron.schedule("0 0 * * *", fetchTeamsCronJob);
cron.schedule("0 2 1 * *", fetchCountriesCronJob);
console.log("Cron jobs are set.");

export default fetchTeams;
