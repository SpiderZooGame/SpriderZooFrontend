const pool = require("../../../database-connection");
const queries = require("../queries/playerQueries");

const addPlayer = (req, res) => {
  const { username, email } = req.body;

  pool.query(queries.addPlayer, [username, email], (error, results) => {
    if (error)
      res.status(500).json({ status: 500, message: "Internal server error" });

    res
      .status(201)
      .json({ status: 201, message: "Player created successfully" });
  });
};

module.exports = {
  addPlayer,
};
