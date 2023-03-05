import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useSelector } from "react-redux";
import Spinner from "./components/Spinner";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import ApplyDoctor from "./pages/ApplyDoctor";
import Users from "./pages/admin/Users";
import Doctors from "./pages/admin/Doctors";
import Profile from "./pages/doctor/Profile";
import Booking from "./pages/Booking";
import Notification from "./pages/Notification";
import Appointments from "./pages/Appointments";
import DoctorAppointments from "./pages/doctor/DoctorAppointments";
import Home from "./pages/Home";

function App() {
	const { loading } = useSelector((state) => state.alerts);
	return (
		<>
			{loading ? (
				<Spinner />
			) : (
				<Routes>
					<Route
						path="/apply-doctor"
						element={
							<ProtectedRoute>
								<ApplyDoctor />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/admin/users"
						element={
							<ProtectedRoute>
								<Users />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/admin/doctors"
						element={
							<ProtectedRoute>
								<Doctors />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/doctor/profile/:id"
						element={
							<ProtectedRoute>
								<Profile />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/doctor/book-appointment/:doctorId"
						element={
							<ProtectedRoute>
								<Booking />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/notification"
						element={
							<ProtectedRoute>
								<Notification />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/login"
						element={
							<PublicRoute>
								<Login />
							</PublicRoute>
						}
					/>
					<Route
						path="/register"
						element={
							<PublicRoute>
								<Register />
							</PublicRoute>
						}
					/>
					<Route
						path="/appointments"
						element={
							<ProtectedRoute>
								<Appointments />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/doctor-appointments"
						element={
							<ProtectedRoute>
								<DoctorAppointments />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/"
						element={
							<ProtectedRoute>
								<Home />
							</ProtectedRoute>
						}
					/>
				</Routes>
			)}
		</>
	);
}

export default App;
