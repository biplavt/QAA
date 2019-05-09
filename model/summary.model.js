var {mySqlConfig} = require('./../configuration/prodDatabase.config.js');
var makeConnection = require('./utility/utilityModel.js');


/***
    Function: Returns all the testData Summary present in our system (ie. all test data present (not lines) in our database)
        Called by /v1/QAA/testData ==> gTestDataSummary()
    Input: None
    Output: Returns a promise that has array of Objects {testID,employeeID,EmployeeName, Location, ProductID,QuantityInspected,InspectionDate,Status}
    Time Complexity: O(Async)
***/
function getTestDataSummary() {

    var ourQuery = `SELECT testID, employeeID, EmployeeName, Location, ProductID, Product, QuantityInspected, 
        Date_Format(InspectionDate, '%m-%d-%Y') as InspectionDate, Status FROM QAA.TestSummary`;

    return makeConnection.mysqlQueryExecution(ourQuery, mySqlConfig);
}

/***
    Function: Returns all the test lines for particular Test using TestID
        Called by /v1/QAA/testDetailByID/:testID  ==> gTestDetailByTestId()
    Input: Test Case ID
    Output: returns a promise that has array of Objects {testID, modelID, workcell, Qty, criteriaName, criteriaID,rangeID, rangeIdeal, rangeLow,rangeHigh,testData,Status, testStatus, Unit}
    Time Complexity: O(Async)
***/
function getTestDetailByTestId(testCaseID) {
 
    var ourQuery = `select Unit,testID, modelID, workCell,  QuantityInspected, criteriaName, criteriaID,rangeID, rangeIdeal, rangeLow, rangeHigh,testData, Status,testStatus
        from QAA.TestDetail where testID = ?`; //for testlines

    return makeConnection.mysqlQueryExecution(ourQuery, mySqlConfig, testCaseID);
}

/***
    Function: Returns all the test lines for particular Test using TestID
        Called by /v1/QAA/testDetailByID/:testID  ==> gTestDetailByTestId()
    Input: Test Case ID
    Output: returns a promise that has array of Objects {testID, employeeID,locationID,modelID,Qty,verified, date}
    Time Complexity: O(Async)
***/
function getTestDataSummaryByTestId(testCaseID) {

    var ourQuery=`select testID, employeeID,locationID,modelID,Qty,verified,Date_Format(date, '%m-%d-%Y') as date from QAA.testData_TB where testID= ${testCaseID} `; //for testData
    return makeConnection.mysqlQueryExecution(ourQuery, mySqlConfig, testCaseID);
}

/***
    Function: Posts the test data summary in request body 
        Called by POST /v1/QAA/testData ==> pTestDataSummary()
    Input: new test body
    Output: Returns a promise that returns the insert ID
    Time Complexity: O(Async) 
***/
function postTestDataSummary(input) {

    let values = [input.employeeID, input.locationID, input.modelID, input.Qty, 0]
    var ourQuery = `Insert into QAA.testData_TB (employeeID, locationID, modelID,Qty,verified) values (?)`;
    return makeConnection.mysqlQueryExecution(ourQuery, mySqlConfig, values);
}

/***
    Function: Returns all the test lines for particular Test using TestID
        Called by POST /v1/QAA/testData  ==> pTestDataSummary() and gTestline()
    Input: Test Case ID
    Output: Returns a promise that has an array of Objects {testID, modelID, workcell, Qty, criteriaName, criteriaID,rangeID, rangeIdeal, rangeLow,rangeHigh,testData,Status, testStatus, Unit}
    Time Complexity: O(Async)
***/
function getTestLine(testCaseID) {

    var ourQuery = `select testID,criteriaID,modelID,criteriaName,rangeID,rangeIdeal,rangeLow,rangeHigh,Unit from QAA.testLine where testID = ? `;
    return makeConnection.mysqlQueryExecution(ourQuery, mySqlConfig, testCaseID);
}

/***
    Function: Posts the test lines present in request body (upserts it as of now)
        Called by POST /v1/QAA/testLine ==> pTestLine()
        { first formats the input object to an array of values to be given to SQL query, calculates overall test status, 
            upserts the data in testline table and then updates status in testData table }
    Input: new test lines
    Output: returns the insert result from mysql (fieldcount, insertID,affectedRows,warning count,message, protocol141,changedRows)
    Time Complexity: O(Async + c), c= number of lines 
***/
function postTestline(input) {
    //for first query( ourQuery)
    let bulkInsertValues = [];

    var ourQuery = `Insert into QAA.testLineData_TB (testID, criteriaID, rangeID,testData,verified) values ?
        ON DUPLICATE KEY UPDATE 
            QAA.testLineData_TB.testData=VALUES(QAA.testLineData_TB.testData), 
            QAA.testLineData_TB.verified=VALUES(QAA.testLineData_TB.verified),
            QAA.testLineData_TB.date=CURRENT_TIMESTAMP`;

    //convert object to array for first SQL query
    input.testData.forEach(criteria => {

        let values = Object.keys(criteria).map(function(_) { return criteria[_]; })
        bulkInsertValues.push(values);
    });

    //for second query (newUpdateQuery) ie. updates the testStatus in testData_TB

    //calculate the overall test status for newUpdateQuery query
    let testStatus = input.OverallTestStatus;
    let testId=input.testData[0].TestCase;
    //to prevent sql injection, make the sql call only if the test status is 1 or 0
    if(testStatus==1 || testStatus==0)
        var newUpdateQuery = `UPDATE QAA.testData_TB SET verified = ${testStatus} WHERE testID= ?`;
    else {
        return new Promise(function(resolve,reject){
            reject({'Error':'Invalid TestStatus'})
        })
    }

    return new Promise(function(resolve, reject) {
        makeConnection.mysqlQueryExecution(ourQuery, mySqlConfig, bulkInsertValues).then(function(result) {
            return makeConnection.mysqlQueryExecution(newUpdateQuery, mySqlConfig, testId);
        }).then(function(result) {
            resolve(result);
        }, function(error) {
            reject({ error: error.sqlMessage });
        })
    })
}



/***
    Function: Gets all the available location (as of now, only one location, i.e sparks)
        Called by GET /v1/QAA/Location ==> gLocation()
    Input: None
    Output: returns promise that contains the locations with id (locationID, locationName)
    Time Complexity: O(Async) 
***/
function getLocation() {

    var ourQuery = 'SELECT locationID,locationName FROM QAA.location_TB';
    return makeConnection.mysqlQueryExecution(ourQuery, mySqlConfig);
}


/***
    Function: Gets all the available models 
        Called by GET /v1/QAA/Models ==> gModel()
    Input: None
    Output: returns a promise with the locations with id (modelID, modelName)
    Time Complexity: O(Async) 
***/
function getModels() {

    var ourQuery = 'SELECT modelID, modelName FROM QAA.model_TB';
    return makeConnection.mysqlQueryExecution(ourQuery, mySqlConfig);
}


/***
    Function: Gets all the quality inspection criteria 
        Called by GET /v1/QAA/allCriteria   ==>gAllCriteria()
    Input: None
    Output: returns a promise with the locations with id (criteriaID, criteriaName)
    Time Complexity: O(Async) 
***/
function getAllCriteria() {
    var ourQuery = 'SELECT criteriaID, criteriaName FROM QAA.criteria_TB';
    return makeConnection.mysqlQueryExecution(ourQuery, mySqlConfig);
}

/***
    Function: Gets all the quality inspection criteria 
        Called by GET /v1/QAA/rangeValuesForRangeID/:rangeID  =>gRangeValuesForRangeId()
    Input: rangeID
    Output: returns a promise that has the range values for this rangeID (rangeIdeal, rangeLow, rangeHigh)
    Time Complexity: O(Async) 
***/
function getRangeValuesForRangeId(rangeId) {
    var ourQuery = `SELECT rangeIdeal, rangeLow, rangeHigh FROM QAA.range_TB WHERE rangeID = ? `;
    return makeConnection.mysqlQueryExecution(ourQuery, mySqlConfig, rangeId);
}

/***
    Function: Gets all the users 
        Called by GET /v1/QAA/Users  ==> gUsers()
    Input: None
    Output: returns promise with the list of users (employeeID, name)
    Time Complexity: O(Async) 
***/
function getUsers() {
    var ourQuery = 'SELECT employeeID, name FROM QAA.user_TB';
    return makeConnection.mysqlQueryExecution(ourQuery, mySqlConfig);
}

/***
    Function: Gets the roles of a user (imported by WebApp)
        Called by GET /v1/QAA/rolesByEmail/:emailId ==>gRolesByEmail()
    Input: emailId
    Output: returns the list of roles of users (<roles>)
    Time Complexity: O(Async + n) ; n=number of roles 
***/
function getRolesByEmail(email) {

    var ourQuery = `SELECT C.role 
        FROM HawsWA.Users_TB A 
        LEFT JOIN
            HawsWA.Users_Role_TB B
            ON A.userId = B.userId
        LEFT JOIN
            HawsWA.Roles_TB C
            ON B.roleId=C.roleID
        WHERE A.email= ? `;

    return makeConnection.mysqlQueryExecution(ourQuery, mySqlConfig,email);

}

module.exports = {
    getTestDataSummary,
    getTestDataSummaryByTestId,
    getTestDetailByTestId,
    getLocation,
    getModels,
    postTestDataSummary,
    getTestLine,
    postTestline,
    getAllCriteria,
    getRangeValuesForRangeId,
    getUsers,
    getRolesByEmail
}