const addPlayer = "INSERT INTO players (username, email) VALUES ($1, $2)";
const getPlayer = "SELECT * FROM players WHERE username = $1";

module.exports = {
  addPlayer,
  getPlayer,
};
