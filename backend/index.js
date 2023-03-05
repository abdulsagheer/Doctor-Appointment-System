const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const colors = require("colors");
const connectDb = require("./config/connectDb");
// config dot env file
dotenv.config();

//databse call
connectDb();

//rest object
const app = express();

//middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

//routes
app.use("/api/v1/user", require("./routes/userRoute"));
app.use("/api/v1/admin", require("./routes/adminRoute"));
app.use("/api/v1/doctor", require("./routes/doctorRoute"));

//port
const port = process.env.PORT || 8080;

//listen port
app.listen(port, () => {
	console.log(
		`Server Running in ${process.env.NODE_MODE} Mode on port ${process.env.PORT}`
			.bgCyan.white
	);
});
