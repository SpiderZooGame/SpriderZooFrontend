const addPlayer = "INSERT INTO players (username, email) VALUES ($1, $2)";
const getPlayer = "SELECT * FROM players WHERE (username = $1 AND email = $2)";

module.exports = {
  addPlayer,
  getPlayer,
};
