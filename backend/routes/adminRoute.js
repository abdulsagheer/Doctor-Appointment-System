const express = require("express");
const {
	getAllUsers,
	getAllDoctors,
	changeAccountStatus,
} = require("../controllers/admin.controller");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

//GET METHOD || USERS
router.get("/getAllUsers", authMiddleware, getAllUsers);

//GET METHOD || DOCTORS
router.get("/getAllDoctors", authMiddleware, getAllDoctors);

//POST ACCOUNT STATUS
router.post("/changeAccountStatus", authMiddleware, changeAccountStatus);

module.exports = router;
