const pool = require("../../../database-connection");
const queries = require("../queries/badgeQueries");

const getPlayerBadges = (req, res) => {
  let player_id;
  // get player_id
  // cast to int

  pool.query(queries.getPlayerBadges, [player_id], (error, results) => {
    if (error)
      res.status(500).json({ status: 500, message: "Internal server error" });

    res.status(200).json(results.rows);
  });
};

module.exports = {
  getPlayerBadges,
};
