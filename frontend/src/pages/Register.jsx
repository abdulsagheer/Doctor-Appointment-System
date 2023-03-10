import React from "react";
import "../styles/RegiserStyles.css";
import { Form, Input, message } from "antd";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";

const Register = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	//form handler
	const onfinishHandler = async (values) => {
		try {
			dispatch(showLoading());
			const res = await axios.post(
				`${import.meta.env.VITE_API_URL}/api/v1/user/register`,
				values
			);
			dispatch(hideLoading());
			if (res.data.success) {
				message.success("Register Successfully!");
				navigate("/login");
			} else {
				message.error(res.data.message);
			}
		} catch (error) {
			dispatch(hideLoading());
			console.log(error);
			message.error("Something Went Wrong");
		}
	};
	return (
		<>
			<div className="form-container">
				<Form
					layout="vertical"
					onFinish={onfinishHandler}
					className="register-form p-5">
					<h3 className="text-center">Register From</h3>
					<Form.Item label="Name" name="name">
						<Input type="text" required />
					</Form.Item>
					<Form.Item label="Email" name="email">
						<Input type="email" required />
					</Form.Item>
					<Form.Item label="Password" name="password">
						<Input type="password" required />
					</Form.Item>
					<Link to="/login" className="m-2">
						Already user login here
					</Link>
					<div className="text-center mt-4">
						<button className="btn btn-primary" type="submit">
							Register
						</button>
					</div>
				</Form>
			</div>
		</>
	);
};

export default Register;
