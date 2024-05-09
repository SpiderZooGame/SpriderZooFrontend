const getPlayerBadges =
  "SELECT * FROM badges JOIN playerbadges ON badges.badge_id = playerbadges.badge_id WHERE playerbadges.player_id = $1";
const hasBadge =
  "SELECT EXISTS (SELECT 1 FROM playerbadges WHERE player_id = $1 AND badge_id = $2) AS has_badge";
const getBadge = "SELECT * FROM badges WHERE badges.badge_id = $1";
const addPlayerBadge =
  "INSERT INTO playerbadges (date_awarded, player_id, badge_id) VALUES ($1, $2, $3)";

module.exports = {
  getPlayerBadges,
  hasBadge,
  getBadge,
  addPlayerBadge,
};
