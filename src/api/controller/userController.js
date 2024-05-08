const pool = require("../../../database-connection");
const queries = require("../queries/useQueries");

const getUsers = (req, res) => {
  pool.query(queries.getUsers, (error, results) => {
    if (error)
      res.status(500).json({ status: 500, message: "Internal server error" });

    res.status(200).json(results.rows);
  });
};

const getUserByEmail = (req, res) => {
  const email = req.params.email;

  pool.query(queries.getUserByEmail, [email], (error, results) => {
    if (error)
      res.status(500).json({ status: 500, message: "Internal server error" });

    res.status(200).json(results.rows);
  });
};

module.exports = {
  getUsers,
  getUserByEmail,
};
