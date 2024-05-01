const { Router } = require("express");
const controller = require("../controller/userController");

const router = Router();

router.get("/", controller.getUsers);
router.get("/:email", controller.getUserByEmail);

module.exports = router;
