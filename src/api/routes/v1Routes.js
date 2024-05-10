const { Router } = require("express");
const playerHandler = require("../handlers/playerHandler");
const scoreHandler = require("../handlers/scoreHandler");
const badgeHandler = require("../handlers/badgeHandler");
const { auth } = require("../../../oauth/authorization");

const router = Router();

router.post("/players", playerHandler.addPlayer);

router.get("/scores/leaderboard", scoreHandler.getLeaderboard);
router.post("/scores", auth, scoreHandler.addScore);

router.get("/badges/playerbadges", auth, badgeHandler.getPlayerBadges);

module.exports = router;
