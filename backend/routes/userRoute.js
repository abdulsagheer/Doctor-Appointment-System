const express = require("express");
const {
	login,
	register,
	auth,
	applyDoctor,
	getAllNotification,
	deleteAllNotification,
	getAllDoctors,
	bookAppointment,
	bookingAvailability,
	userAppointments,
} = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/authMiddleware");

//router object
const router = express.Router();

//routes
//LOGIN || POST
router.post("/login", login);

//REGISTER || POST
router.post("/register", register);

//Auth || POST
router.post("/getUserData", authMiddleware, auth);

//APply Doctor || POST
router.post("/apply-doctor", authMiddleware, applyDoctor);

//Notification  Doctor || POST
router.post("/get-all-notification", authMiddleware, getAllNotification);
//Notification  Doctor || POST
router.post("/delete-all-notification", authMiddleware, deleteAllNotification);

//GET ALL DOC
router.get("/getAllDoctors", authMiddleware, getAllDoctors);

//BOOK APPOINTMENT
router.post("/book-appointment", authMiddleware, bookAppointment);

//Booking Avliability
router.post("/booking-availability", authMiddleware, bookingAvailability);

//Appointments List
router.get("/user-appointments", authMiddleware, userAppointments);

module.exports = router;
