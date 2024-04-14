
const mysql = require('mysql');
const pool = dbConnection();

/*
async function executeSQL(sql, params) {
  return new Promise(function(resolve, reject) {
    pool.query(sql, params, function(err, rows, fields) {
      if (err) throw err;
      resolve(rows);
    });
  });
}
*/

async function executeSQL(sql, params) {
	return new Promise(function(resolve, reject) {
    	pool.query(sql, params, function(err, rows, fields) {
    		if (err) {
				return err;
	  		}
      		resolve(rows);
			return null;
    	});
  	});
}


function dbConnection() {
  const pool = mysql.createPool({
    connectTimeout: 60 * 60 * 1000,
    acquireTimeout: 60 * 60 * 1000,
    connectionLimit: 10,
    host: "h2cwrn74535xdazj.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "oynqhup71k56jj0y",
    password: "jkv88aqmtzrpzqa3",
    database: "j59qb6u7tk71ja7u"

  });
  return pool;
}

exports.executeSQL = executeSQL;
