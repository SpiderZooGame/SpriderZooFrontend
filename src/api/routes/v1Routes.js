const { Router } = require("express");
const playerController = require("../controller/playerController");
const scoreController = require("../controller/scoreController");
const badgeController = require("../controller/badgeController");
const { auth } = require("../../../oauth/authorization");

const router = Router();

router.post("/players", playerController.addPlayer);

router.get("/scores/leaderboard", scoreController.getLeaderboard);
router.post("/scores", auth, scoreController.addScore);

router.get("/badges/playerbadges", auth, badgeController.getPlayerBadges);

module.exports = router;
