const pool = require("../../../database-connection");
const badgeQueries = require("../queries/badgeQueries");
const playerQueries = require("../queries/playerQueries");
const {
  getTokenData,
  githubValidateUser,
} = require("../../../oauth/authorization");

const getPlayerBadges = async (req, res) => {
  const token = req.headers["authorization"].split(" ")[1];

  const githubToken = getTokenData(token);
  const githubUser = await githubValidateUser(githubToken.token);
  const username = JSON.parse(githubUser.toString()).login;

  pool.query(
    playerQueries.getPlayer,
    [username],
    (getPlayerError, getPlayerResult) => {
      if (getPlayerError) {
        res.status(500).json({ status: 500, message: "Internal server error" });
      } else {
        const player_id = getPlayerResult.rows[0].player_id;

        pool.query(
          badgeQueries.getPlayerBadges,
          [player_id],
          (getPlayerBadgesError, getPlayerBadgesResult) => {
            if (getPlayerBadgesError) {
              res
                .status(500)
                .json({ status: 500, message: "Internal server error" });
            }

            res.status(200).json(getPlayerBadgesResult.rows);
          }
        );
      }
    }
  );
};

module.exports = {
  getPlayerBadges,
};
