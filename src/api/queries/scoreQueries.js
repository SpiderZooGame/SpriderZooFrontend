const getLeaderboard =
  "SELECT players.username, MAX(scores.score) AS high_score FROM players JOIN scores ON players.player_id = scores.player_id GROUP BY players.username ORDER BY high_score DESC";
const getLeaderboardWithLimit =
  "SELECT players.username, MAX(scores.score) AS high_score FROM players JOIN scores ON players.player_id = scores.player_id GROUP BY players.username ORDER BY high_score DESC LIMIT $1";

const addScore =
  "INSERT INTO scores (score, score_date, player_id) VALUES ($1, $2, $3)";
const getPlayerScores = "SELECT * FROM scores WHERE scores.player_id = $1";

const hasPlayedConsecutiveDays =
  "WITH consecutive_dates AS (SELECT score_date, (score_date - LAG(score_date) OVER (ORDER BY score_date))::int AS date_diff FROM scores WHERE player_id = $1) SELECT COUNT(*) >= $2 AS has_consecutive_scores FROM consecutive_dates WHERE date_diff = 1;";

module.exports = {
  getLeaderboard,
  getLeaderboardWithLimit,
  addScore,
  getPlayerScores,
  hasPlayedConsecutiveDays,
};
