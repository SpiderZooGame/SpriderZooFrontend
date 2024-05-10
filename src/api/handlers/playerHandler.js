const pool = require("../../../database-connection");
const queries = require("../queries/playerQueries");

const addPlayer = async (req, res) => {
  const { username, email } = req.body;

  const player = await pool.query(queries.getPlayer, [username]);

  if (player.rowCount === 0) {
    pool.query(queries.addPlayer, [username, email], (error, result) => {
      if (error) {
        res.status(500).json({ status: 500, message: "Internal server error" });
      } else {
        res
          .status(201)
          .json({ status: 201, message: "Player created successfully" });
      }
    });
  } else {
    res.status(200).json({ status: 200, message: "Player already exists" });
  }
};

module.exports = {
  addPlayer,
};
