var {mySqlConfig} = require('./../configuration/prodDatabase.config.js');
var makeConnection = require('./utility/utilityModel.js');


/***
    Function: Returns all the testData Summary present in our system 
        Called by /v1/QAA/testData ==> gTestDataSummary()
    Input: None
    Output: Array of Objects {testID,employeeID,EmployeeName, Location, ProductID,QuantityInspected,InspectionDate,Status}
    Time Complexity: O(Async)
***/
function getTestDataSummary() {

    var ourQuery = `SELECT testID, employeeID, EmployeeName, Location, ProductID, Product, QuantityInspected, 
        Date_Format(InspectionDate, '%m-%d-%Y') as InspectionDate, Status FROM QAA.TestSummary`;

    return makeConnection.mysqlQueryExecution(ourQuery, mySqlConfig);
}

/***
    Function: Returns all the test lines for particular Test using TestID
        Called by /v1/QAA/testDetailByID/:testID 
    Input: Test ID
    Output: Array of Objects {testID, modelID, workcell, Qty, criteriaName, criteriaID,rangeID, rangeIdeal, rangeLow,rangeHigh,testData,Status, testStatus, Unit}
    Time Complexity: O(Async) + C, C=number of testlines for a particular testID (usually 4)
***/
function getTestDetailByTestId(testCaseID) {
    var ourQuery = `select Unit,testID, modelID, workCell,  QuantityInspected, criteriaName, criteriaID,rangeID, rangeIdeal, rangeLow, rangeHigh,testData, Status,testStatus
        from QAA.TestDetail where testID = ?`; //for testlines
    // console.log('*');
    return makeConnection.mysqlQueryExecution(ourQuery, mySqlConfig, testCaseID);
}

function getTestDataSummaryByTestId(testCaseID) {
    var ourQuery=`select testID, employeeID,locationID,modelID,Qty,verified,Date_Format(date, '%m-%d-%Y') as date from QAA.testData_TB where testID= ${testCaseID} `; //for testData
    
    return makeConnection.mysqlQueryExecution(ourQuery, mySqlConfig, testCaseID);

}




function getLocation() {

    var ourQuery = 'SELECT locationID,locationName FROM QAA.location_TB';
    return makeConnection.mysqlQueryExecution(ourQuery, mySqlConfig);
}

function getModels() {
    var ourQuery = 'SELECT modelID, modelName FROM QAA.model_TB';
    return makeConnection.mysqlQueryExecution(ourQuery, mySqlConfig);
}

function postTestDataSummary(input) {
    // console.log('input:',input.employeeID, input.locationID,input.modelID,input.Qty);
    let values = [input.employeeID, input.locationID, input.modelID, input.Qty, 0]
    // console.log(values);

    // var ourQuery = `Insert into QAA.testData_TB (employeeID, locationID, modelID,Qty,verified) values ('${input.employeeID}',${input.locationID},'${input.modelID}',${input.Qty},0)`;
    var ourQuery = `Insert into QAA.testData_TB (employeeID, locationID, modelID,Qty,verified) values (?)`;
    // console.log(ourQuery);
    return makeConnection.mysqlQueryExecution(ourQuery, mySqlConfig, values);
}


function postTestline(input) {
    //for first query( ourQuery)
    let bulkInsertValues = [];

    var ourQuery = `Insert into QAA.testLineData_TB (testID, criteriaID, rangeID,testData,verified) values ?
        ON DUPLICATE KEY UPDATE 
        QAA.testLineData_TB.testData=VALUES(QAA.testLineData_TB.testData), 
        QAA.testLineData_TB.verified=VALUES(QAA.testLineData_TB.verified),
        QAA.testLineData_TB.date=CURRENT_TIMESTAMP`;

    input.forEach(criteria => {

        let values = Object.keys(criteria).map(function(_) { return criteria[_]; })

        bulkInsertValues.push(values);

    });

    // console.log("bulkInsertValues:", bulkInsertValues);

    //for second query (newUpdateQuery) ie. updates the testStatus in testData_TB

    let testStatus = true;
    input.forEach(function(testLine) {
        testStatus = testStatus && testLine.testStatus
    });

    var newUpdateQuery = `UPDATE QAA.testData_TB SET verified = ${testStatus} WHERE testID= ?`


    return new Promise(function(resolve, reject) {
        makeConnection.mysqlQueryExecution(ourQuery, mySqlConfig, bulkInsertValues).then(function(result) {
            return makeConnection.mysqlQueryExecution(newUpdateQuery, mySqlConfig, input[0].TestCase);
        }).then(function(result) {
            resolve(result);
        }, function(error) {
            reject({ error: error.sqlMessage });
        })
    })
}


function getTestLine(testCaseID) {
    // console.log('testCaseID:',testCaseID);
    var ourQuery = `select * from QAA.testLine where testID = ${testCaseID}`;
    // var ourQuery = `select testID,criteriaID,modelID,criteriaName,rangeID,rangeIdeal,rangeLow,rangeHigh,Unit from QAA.testLine where testID = ? `;

    return makeConnection.mysqlQueryExecution(ourQuery, mySqlConfig, testCaseID);
}

function getAllCriteria() {
    var ourQuery = 'SELECT criteriaID, criteriaName FROM QAA.criteria_TB';
    return makeConnection.mysqlQueryExecution(ourQuery, mySqlConfig);
}

function getRangeValuesForRangeId(rangeId) {
    var ourQuery = `SELECT rangeIdeal, rangeLow, rangeHigh FROM QAA.range_TB WHERE rangeID = ? `;
    return makeConnection.mysqlQueryExecution(ourQuery, mySqlConfig, rangeId);
}

function getUsers() {
    var ourQuery = 'SELECT employeeID, name FROM QAA.user_TB';
    return makeConnection.mysqlQueryExecution(ourQuery, mySqlConfig);
}

function getRolesByEmail(email) {

    var ourQuery = `SELECT C.role 
        FROM HawsWA.Users_TB A 
        LEFT JOIN
            HawsWA.Users_Role_TB B
            ON A.userId = B.userId
        LEFT JOIN
            HawsWA.Roles_TB C
            ON B.roleId=C.roleID
        WHERE A.email='${email}' `;

    return makeConnection.mysqlQueryExecution(ourQuery, mySqlConfig);

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