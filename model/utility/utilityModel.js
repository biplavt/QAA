const mysql=require('mysql');
const connectionParams=require('./../../configuration/prodDatabase.config.js');

var sqlQueryExecution=function(ourQuery,config,values){

	return new Promise (function (resolve, reject){

		var newConnection= mysql.createPool(config.parameters);

		newConnection.query(ourQuery,values,function(error,result){

			if(error)
				reject(error);

			else{
			
				resolve(result);
			
			}
		
		})

	})
}




module.exports={
	sqlQueryExecution
}


