const mysql = require("mysql");
const config = require("../config");
var pool = mysql.createPool({
	host: config.development.database.host,
	user: config.development.database.user,
	password: config.development.database.password,
	database: config.development.database.database,
	port: config.development.database.port,
});

function dbDisconnect() {
	pool.getConnection((err, conn) => {
		if (conn.destroy() || conn.end()) return true;
		return false;
	});
}

function dbTestConnection(callback) {
	return pool.getConnection((err, conn) => {
		res = { status: "unknow" };
		if (err) res = { error: err };
		res = { status: "connected" };
		callback(res);
		conn.release();
	});
}

/**
 * @function db_query - Function to access database and using query
 * @param {string} query - Put your query here
 * @param {function} callback function to get callback (err, rows) => {}
 */
function dbQuery(query, callback) {
	_executeQuery(query, (err, rows) => {
		if (!err) {
			callback(null, rows);
		} else {
			callback(err, null);
		}
	});
}

function _executeQuery(query, callback) {
	pool.getConnection((err, connection) => {
		if (err) {
			console.log(err);
			return callback("Get Connection Error. Error:" + err, null);
		} else if (connection) {
			connection.query(query, (err, rows, fields) => {
				connection.release();
				if (err) {
					console.log(err);
					return callback("Err. " + err, null);
				}
				return callback(null, rows);
			});
		} else {
			connection.release();
			return callback(true, "No Connection");
		}
	});
}
module.exports = {
	pool,
	dbDisconnect,
	dbQuery,
	dbTestConnection,
};
