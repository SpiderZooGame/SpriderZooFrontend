const addPlayer = "INSERT INTO players (username, email) VALUES ($1, $2)";

module.exports = {
  addPlayer,
};
