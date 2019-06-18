const mysql = require('mysql');
const connectionParams = require('./../../configuration/prodDatabase.config.js');

var mysqlQueryExecution = function (ourQuery, config, values) {

	return new Promise(function (resolve, reject) {

		var newConnection = mysql.createPool(config);

		newConnection.query(ourQuery, [values], function (error, result) {

			if (error)
				reject(error);

			else {
				// console.log('result:',result);
				resolve(result);

			}

		})

	})
}




module.exports = {
	mysqlQueryExecution
}


