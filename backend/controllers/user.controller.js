const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");

const register = async (req, res) => {
	try {
		const existingUser = await User.findOne({ email: req.body.email });
		if (existingUser) {
			return res
				.status(200)
				.send({ message: "User Already Exist", success: false });
		}
		const password = req.body.password;
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);
		req.body.password = hashedPassword;
		const newUser = new User(req.body);
		await newUser.save();
		res.status(201).send({ message: "Register Successfully", success: true });
	} catch (error) {
		console.log(error);
		res.status(500).send({
			success: false,
			message: `Error while Register ${error.message}`,
		});
	}
};

const login = async (req, res) => {
	try {
		const user = await User.findOne({ email: req.body.email });
		if (!user) {
			return res
				.status(200)
				.send({ message: "user not found", success: false });
		}
		const isMatch = await bcrypt.compare(req.body.password, user.password);
		if (!isMatch) {
			return res
				.status(200)
				.send({ message: "Invlid EMail or Password", success: false });
		}
		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
			expiresIn: "1d",
		});
		res.status(200).send({ message: "Login Success", success: true, token });
	} catch (error) {
		console.log(error);
		res.status(500).send({ message: `Error in Login ${error.message}` });
	}
};

const auth = async (req, res) => {
	try {
		const user = await User.findById({ _id: req.body.userId });
		user.password = undefined;
		if (!user) {
			return res.status(200).send({
				message: "user not found",
				success: false,
			});
		} else {
			res.status(200).send({
				success: true,
				data: user,
			});
		}
	} catch (error) {
		console.log(error);
		res.status(500).send({
			message: "auth error",
			success: false,
			error,
		});
	}
};

const applyDoctor = async (req, res) => {
	try {
		const newDoctor = await Doctor({ ...req.body, status: "pending" });
		await newDoctor.save();
		const adminUser = await User.findOne({ isAdmin: true });
		const notification = adminUser.notification;
		notification.push({
			type: "apply-doctor-request",
			message: `${newDoctor.firstName} ${newDoctor.lastName} Has Applied for a doctor account`,
			data: {
				doctorId: newDoctor._id,
				name: newDoctor.firstName + " " + newDoctor.lastName,
				onClickPath: "/admin/doctors",
			},
		});
		await User.findByIdAndUpdate(adminUser._id, { notification });
		res.status(201).send({
			success: true,
			message: "Doctor Account Applied Successfully",
		});
	} catch (error) {
		console.log(error);
		res.status(500).send({
			success: false,
			error,
			message: "Error While Applying For Doctor",
		});
	}
};

//notification ctrl
const getAllNotification = async (req, res) => {
	try {
		const user = await User.findOne({ _id: req.body.userId });
		const seennotification = user.seennotification;
		const notification = user.notification;
		seennotification.push(...notification);
		user.notification = [];
		user.seennotification = notification;
		const updatedUser = await user.save();
		res.status(200).send({
			success: true,
			message: "all notification marked as read",
			data: updatedUser,
		});
	} catch (error) {
		console.log(error);
		res.status(500).send({
			message: "Error in notification",
			success: false,
			error,
		});
	}
};

// delete notifications
const deleteAllNotification = async (req, res) => {
	try {
		const user = await User.findOne({ _id: req.body.userId });
		user.notification = [];
		user.seennotification = [];
		const updatedUser = await user.save();
		updatedUser.password = undefined;
		res.status(200).send({
			success: true,
			message: "Notifications Deleted successfully",
			data: updatedUser,
		});
	} catch (error) {
		console.log(error);
		res.status(500).send({
			success: false,
			message: "unable to delete all notifications",
			error,
		});
	}
};

//GET ALL DOC
const getAllDoctors = async (req, res) => {
	try {
		const doctors = await Doctor.find({ status: "approved" });
		res.status(200).send({
			success: true,
			message: "Doctors Lists Fetched Successfully",
			data: doctors,
		});
	} catch (error) {
		console.log(error);
		res.status(500).send({
			success: false,
			error,
			message: "Error While Fetching Doctor",
		});
	}
};

//BOOK APPOINTMENT
const bookAppointment = async (req, res) => {
	try {
		req.body.date = moment(req.body.date, "DD-MM-YYYY").toISOString();
		req.body.time = moment(req.body.time, "HH:mm").toISOString();
		req.body.status = "pending";
		const newAppointment = new Appointment(req.body);
		await newAppointment.save();
		const user = await User.findOne({ _id: req.body.doctorInfo.userId });
		user.notification.push({
			type: "New-appointment-request",
			message: `A New Appointment Request from ${req.body.userInfo.name}`,
			onClickPath: "/user/appointments",
		});
		await user.save();
		res.status(200).send({
			success: true,
			message: "Appointment Book successfully",
		});
	} catch (error) {
		console.log(error);
		res.status(500).send({
			success: false,
			error,
			message: "Error While Booking Appointment",
		});
	}
};

// booking bookingAvailability
const bookingAvailability = async (req, res) => {
	try {
		const date = moment(req.body.date, "DD-MM-YY").toISOString();
		const fromTime = moment(req.body.time, "HH:mm")
			.subtract(1, "hours")
			.toISOString();
		const toTime = moment(req.body.time, "HH:mm").add(1, "hours").toISOString();
		const doctorId = req.body.doctorId;
		const appointments = await Appointment.find({
			doctorId,
			date,
			time: {
				$gte: fromTime,
				$lte: toTime,
			},
		});
		if (appointments.length > 0) {
			return res.status(200).send({
				message: "Appointments not Available at this time",
				success: true,
			});
		} else {
			return res.status(200).send({
				success: true,
				message: "Appointments available",
			});
		}
	} catch (error) {
		console.log(error);
		res.status(500).send({
			success: false,
			error,
			message: "Error In Booking",
		});
	}
};

const userAppointments = async (req, res) => {
	try {
		const appointments = await Appointment.find({
			userId: req.body.userId,
		});
		res.status(200).send({
			success: true,
			message: "Users Appointments Fetch Successfully",
			data: appointments,
		});
	} catch (error) {
		console.log(error);
		res.status(500).send({
			success: false,
			error,
			message: "Error In User Appointments",
		});
	}
};

module.exports = {
	register,
	login,
	auth,
	applyDoctor,
	getAllNotification,
	userAppointments,
	bookingAvailability,
	bookAppointment,
	getAllDoctors,
	deleteAllNotification,
};
