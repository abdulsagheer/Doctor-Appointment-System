const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const User = require("../models/User");

const getDoctorInfo = async (req, res) => {
	try {
		const doctor = await Doctor.findOne({ userId: req.body.userId });
		res.status(200).send({
			success: true,
			message: "doctor data fetch success",
			data: doctor,
		});
	} catch (error) {
		console.log(error);
		res.status(500).send({
			success: false,
			error,
			message: "Error in Fetching Doctor Details",
		});
	}
};

// update doc profile
const updateProfile = async (req, res) => {
	try {
		const doctor = await Doctor.findOneAndUpdate(
			{ userId: req.body.userId },
			req.body
		);
		res.status(201).send({
			success: true,
			message: "Doctor Profile Updated",
			data: doctor,
		});
	} catch (error) {
		console.log(error);
		res.status(500).send({
			success: false,
			message: "Doctor Profile Update issue",
			error,
		});
	}
};

//get single doctor
const getDoctorById = async (req, res) => {
	try {
		const doctor = await Doctor.findOne({ _id: req.body.doctorId });
		res.status(200).send({
			success: true,
			message: "Single Doctor Info Fetched",
			data: doctor,
		});
	} catch (error) {
		console.log(error);
		res.status(500).send({
			success: false,
			error,
			message: "Error in Single doctor info",
		});
	}
};

const doctorAppointments = async (req, res) => {
	try {
		const doctor = await Doctor.findOne({ userId: req.body.userId });
		const appointments = await Appointment.find({
			doctorId: doctor._id,
		});
		res.status(200).send({
			success: true,
			message: "Doctor Appointments fetch Successfully",
			data: appointments,
		});
	} catch (error) {
		console.log(error);
		res.status(500).send({
			success: false,
			error,
			message: "Error in Doctor Appointments",
		});
	}
};

const updateStatus = async (req, res) => {
	try {
		const { appointmentsId, status } = req.body;
		const appointments = await Appointment.findByIdAndUpdate(appointmentsId, {
			status,
		});
		const user = await User.findOne({ _id: appointments.U });

		const notification = user.notification;
		notification.push({
			type: "status-updated",
			message: `your appointment has been updated ${status}`,
			onCLickPath: "/doctor-appointments",
		});
		await user.save();
		res.status(200).send({
			success: true,
			message: "Appointment Status Updated",
		});
	} catch (error) {
		console.log(error);
		res.status(500).send({
			success: false,
			error,
			message: "Error In Update Status",
		});
	}
};

module.exports = {
	getDoctorInfo,
	updateProfile,
	getDoctorById,
	doctorAppointments,
	updateStatus,
};
