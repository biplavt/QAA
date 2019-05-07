var mySqlConfig = require('./../configuration/prodDatabase.config.js');
var makeConnection = require('./utility/utilityModel.js');


/***
Function: Returns all the testData Summary present in our system 
***/

function getTestDataSummary() {

    var ourQuery = `SELECT testID, employeeID, EmployeeName, Location, ProductID, Product, QuantityInspected, 
        Date_Format(InspectionDate, '%m-%d-%Y') as InspectionDate, Status FROM QAA.TestSummary`;

    return makeConnection.sqlQueryExecution(ourQuery, mySqlConfig);
}

function getTestDataSummaryByTestId(testCaseID) {
    var ourQuery=`select testID, employeeID,locationID,modelID,Qty,verified,Date_Format(date, '%m-%d-%Y') as date from QAA.testData_TB where testID= ? `; //for testData
    
    return makeConnection.sqlQueryExecution(ourQuery, mySqlConfig, testCaseID);

}

function getTestDetailByTestId(testCaseID) {
    var ourQuery = `select Unit,testID, modelID, workCell,  QuantityInspected, criteriaName, criteriaID,rangeID, rangeIdeal, rangeLow, rangeHigh,testData, Status,testStatus
        from QAA.TestDetail where testID = ?`; //for testlines
    // console.log('*');
    return makeConnection.sqlQueryExecution(ourQuery, mySqlConfig, testCaseID);
}


function getLocation() {
    var ourQuery = 'SELECT locationID,locationName FROM QAA.location_TB';
    return makeConnection.sqlQueryExecution(ourQuery, mySqlConfig);
}

function getModels() {
    var ourQuery = 'SELECT modelID, modelName FROM QAA.model_TB';
    return makeConnection.sqlQueryExecution(ourQuery, mySqlConfig);
}

function postTestDataSummary(input) {
    // console.log('input:',input.employeeID, input.locationID,input.modelID,input.Qty);
    let values = [input.employeeID, input.locationID, input.modelID, input.Qty, 0]
    // console.log(values);

    // var ourQuery = `Insert into QAA.testData_TB (employeeID, locationID, modelID,Qty,verified) values ('${input.employeeID}',${input.locationID},'${input.modelID}',${input.Qty},0)`;
    var ourQuery = `Insert into QAA.testData_TB (employeeID, locationID, modelID,Qty,verified) values (?)`;
    // console.log(ourQuery);
    return makeConnection.sqlQueryExecution(ourQuery, mySqlConfig, values);
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
        makeConnection.sqlQueryExecution(ourQuery, mySqlConfig, bulkInsertValues).then(function(result) {
            return makeConnection.sqlQueryExecution(newUpdateQuery, mySqlConfig, input[0].TestCase);
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

    return makeConnection.sqlQueryExecution(ourQuery, mySqlConfig, testCaseID);
}

function getAllCriteria() {
    var ourQuery = 'SELECT criteriaID, criteriaName FROM QAA.criteria_TB';
    return makeConnection.sqlQueryExecution(ourQuery, mySqlConfig);
}

function getRangeValuesForRangeId(rangeId) {
    var ourQuery = `SELECT rangeIdeal, rangeLow, rangeHigh FROM QAA.range_TB WHERE rangeID = ? `;
    return makeConnection.sqlQueryExecution(ourQuery, mySqlConfig, rangeId);
}

function getUsers() {
    var ourQuery = 'SELECT employeeID, name FROM QAA.user_TB';
    return makeConnection.sqlQueryExecution(ourQuery, mySqlConfig);
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
    getUsers
}