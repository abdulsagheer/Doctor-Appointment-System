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

//port
const PORT = 8080 || process.env.PORT;

app.get("/", (req, res) => {
	res.status(200).send({
		message: "Server Up",
	});
});

//listen server
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
