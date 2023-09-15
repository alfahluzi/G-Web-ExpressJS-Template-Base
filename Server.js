// base server configuration
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { urlencoded } = require("express");
const app = express();
app.use(express.json());
app.use(express.static("public"));
app.use(urlencoded(express.urlencoded({ extended: false })));
app.use(cors());
app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
	res.setHeader("Access-Control-Allow-Methods", "Content-Type, Authorization");
	next();
});

// starting server conf
const controller = require("./controller");
app.use("/", controller);
const PORT = 4000;
app.listen(PORT, "localhost", function () {
	console.log(`Server is Listening at Port ${PORT}!`);
});
app.get("/", (req, res) => {
	db_testConnection((result) => {
		let stat = {
			server_status: `Server is active on port ${PORT}`,
			database: result ? result : "unknow",
			end_point: END_POINT,
		};
		return res.json(stat);
	});
});
