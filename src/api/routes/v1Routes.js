const { Router } = require("express");
const playerController = require("../controller/playerController");
const scoreController = require("../controller/scoreController");
const badgeController = require("../controller/badgeController");

const router = Router();

router.post("/players", playerController.addPlayer);

router.get("/scores/leaderboard", scoreController.getLeaderboard);
router.post("/scores", scoreController.addScore);

router.get("/playerbadges", badgeController.getPlayerBadges);

module.exports = router;
