const express = require("express");
const {
	getDoctorInfo,
	updateProfile,
	getDoctorById,
	doctorAppointments,
	updateStatus,
} = require("../controllers/doctor.controller");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

//POST SINGLE DOC INFO
router.post("/getDoctorInfo", authMiddleware, getDoctorInfo);

//POST UPDATE PROFILE
router.post("/updateProfile", authMiddleware, updateProfile);

//POST  GET SINGLE DOC INFO
router.post("/getDoctorById", authMiddleware, getDoctorById);

//GET Appointments
router.get("/doctor-appointments", authMiddleware, doctorAppointments);

//POST Update Status
router.post("/update-status", authMiddleware, updateStatus);

module.exports = router;
