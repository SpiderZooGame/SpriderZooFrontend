const pool = require("../../../database-connection");
const scoreQueries = require("../queries/scoreQueries");
const playerQueries = require("../queries/playerQueries");
const utils = require("../utils/badge_logic");
const {
  getTokenData,
  githubValidateUser,
} = require("../../../oauth/authorization");

const getLeaderboard = async (_, res) => {
  const limit = 10;

  const result = await pool.query(scoreQueries.getLeaderboardWithLimit, [
    limit,
  ]);

  if (result) {
    res.status(200).json(result.rows);
  } else {
    res.status(500).json({ status: 500, message: "Internal server error" });
  }
};

const addScore = async (req, res) => {
  const token = req.headers["authorization"].split(" ")[1];

  const { score } = req.body;

  const date = new Date();

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
          scoreQueries.addScore,
          [score, date.toLocaleDateString(), player_id],
          (error) => {
            if (error) {
              res
                .status(500)
                .json({ status: 500, message: "Internal server error" });
            }

            utils
              .rewardCellarBadge(player_id)
              .then((cellarData) => {
                if (cellarData.length === 0) {
                  utils.rewardWolfBadge(player_id).then((wolfData) => {
                    if (wolfData.length === 0) {
                      utils
                        .rewardBlackWidowBadge(player_id)
                        .then((widowData) => {
                          if (widowData.length === 0) {
                            utils
                              .rewardBrownRecluseBadge(player_id)
                              .then((recluseData) => {
                                if (recluseData.length === 0) {
                                  res.status(201).json({ badges: [] });
                                } else {
                                  res.status(201).json({ badges: recluseData });
                                }
                              });
                          } else {
                            res.status(201).json({ badges: widowData });
                          }
                        });
                    } else {
                      res.status(201).json({ badges: wolfData });
                    }
                  });
                } else {
                  res.status(201).json({ badges: cellarData });
                }
              })
              .catch(() => {
                res
                  .status(500)
                  .json({ status: 500, message: "Internal server error" });
              });
          }
        );
      }
    }
  );
};

module.exports = {
  getLeaderboard,
  addScore,
};
