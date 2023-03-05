const Doctor = require("../models/Doctor");
const User = require("../models/User");

const getAllUsers = async (req, res) => {
	try {
		const users = await User.find({});
		res.status(200).send({
			success: true,
			message: "users data list",
			data: users,
		});
	} catch (error) {
		console.log(error);
		res.status(500).send({
			success: false,
			message: "erorr while fetching users",
			error,
		});
	}
};

const getAllDoctors = async (req, res) => {
	try {
		const doctors = await Doctor.find({});
		res.status(200).send({
			success: true,
			message: "Doctors Data list",
			data: doctors,
		});
	} catch (error) {
		console.log(error);
		res.status(500).send({
			success: false,
			message: "error while getting doctors data",
			error,
		});
	}
};

// doctor account status
const changeAccountStatus = async (req, res) => {
	try {
		const { doctorId, status } = req.body;
		const doctor = await Doctor.findByIdAndUpdate(doctorId, { status });
		const user = await User.findOne({ _id: doctor.userId });
		const notification = user.notification;
		notification.push({
			type: "doctor-account-request-updated",
			message: `Your Doctor Account Request Has ${status} `,
			onClickPath: "/notification",
		});
		user.isDoctor = status === "approved" ? true : false;
		await user.save();
		res.status(201).send({
			success: true,
			message: "Account Status Updated",
			data: doctor,
		});
	} catch (error) {
		console.log(error);
		res.status(500).send({
			success: false,
			message: "Error in Account Status",
			error,
		});
	}
};

module.exports = {
	getAllDoctors,
	getAllUsers,
	changeAccountStatus,
};
