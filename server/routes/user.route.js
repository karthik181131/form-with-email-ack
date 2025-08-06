const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

router.post("/submit-form", userController.submitForm);
router.get("/allUsers", userController.getAllUsers);

module.exports = router;
