const pool = require("../../../database-connection");
const queries = require("../queries/scoreQueries");
const utils = require("../utils/badge_logic");

const getLeaderboard = (req, res) => {
  const limit = 10;

  if (limit) {
    pool.query(queries.getLeaderboardWithLimit, [limit], (error, result) => {
      if (error)
        res.status(500).json({ status: 500, message: "Internal server error" });

      res.status(200).json(result.rows);
      return;
    });
  }
};

const addScore = (req, res) => {
  const { score } = req.body;
  const date = new Date();
  const player_id = 1;

  pool.query(
    queries.addScore,
    [score, date.toLocaleDateString(), player_id],
    (error, _) => {
      if (error)
        res.status(500).json({ status: 500, message: "Internal server error" });

      utils
        .rewardCellarBadge(player_id)
        .then((cellarData) => {
          if (cellarData.length === 0) {
            utils.rewardWolfBadge(player_id).then((wolfData) => {
              if (wolfData.length === 0) {
                utils.rewardBlackWidowBadge(player_id).then((widowData) => {
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
};

module.exports = {
  getLeaderboard,
  addScore,
};
