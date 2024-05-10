const pool = require("../../../database-connection");
const playerQueries = require("../queries/playerQueries");

const addPlayer = async (username, email) => {
  const player = await pool.query(playerQueries.getPlayer, [username, email]);

  if (player.rowCount === 0) {
    return pool.query(playerQueries.addPlayer, [username, email]);
  }
};

module.exports = {
  addPlayer,
};
