var mySqlConfig = require('./../configuration/prodDatabase.config.js');
var makeConnection = require('./utility/utilityModel.js');


function getTestSummary() {

    var ourQuery = `SELECT testID, employeeID, EmployeeName, Location, ProductID, Product, QuantityInspected, 
		InspectionDate, Status FROM QAA.TestSummary`;

    return makeConnection.sqlQueryExecution(ourQuery, mySqlConfig);
}

function getTestDetailByTestId(testCaseID) {
    var ourQuery = `select testID, modelID, workCell, QuantityInspected, criteriaName, rangeIdeal, rangeLow, rangeHigh,testData, Status 
        from QAA.TestDetail where testID = ${testCaseID}`;
    return makeConnection.sqlQueryExecution(ourQuery, mySqlConfig);
}


function getLocation() {
    var ourQuery = 'SELECT * FROM QAA.location_TB';
    return makeConnection.sqlQueryExecution(ourQuery, mySqlConfig);
}

function getModels() {
    var ourQuery = 'SELECT * FROM QAA.model_TB';
    return makeConnection.sqlQueryExecution(ourQuery, mySqlConfig);
}

function postTestSummary(input) {
    // console.log('input:',input.employeeID, input.locationID,input.modelID,input.Qty);
    let values = [input.employeeID, input.locationID, input.modelID, input.Qty]
    console.log(values);

    var ourQuery = `Insert into QAA.testData_TB (employeeID, locationID, modelID,Qty,verified) values ('${input.employeeID}',${input.locationID},'${input.modelID}',${input.Qty},0)`;
    // console.log(ourQuery);
    return makeConnection.sqlQueryExecution(ourQuery, mySqlConfig);
}

function getTestLine(testCaseID) {
    // console.log('testCaseID:',testCaseID);
    var ourQuery = `select * from QAA.testLine where testID = ${testCaseID}`;
    return makeConnection.sqlQueryExecution(ourQuery, mySqlConfig);
}

function postTestline(input) {
    let bulkInsertValues = [];

    input.forEach(criteria => {

        let values = Object.keys(criteria).map(function(_) { return criteria[_]; })

        bulkInsertValues.push(values);

    });
    // console.log("bulkInsertValues:",bulkInsertValues);

    var ourQuery = `Insert  into testLineData_TB (testID, criteriaID, rangeID,testData) values ?`;

    return makeConnection.sqlQueryExecution(ourQuery, mySqlConfig, bulkInsertValues);
}

function getAllCriteria() {
    var ourQuery = 'SELECT criteriaID, criteriaName FROM QAA.criteria_TB';
    return makeConnection.sqlQueryExecution(ourQuery, mySqlConfig);
}

function getRangeValuesForRangeId(rangeId) {
    var ourQuery = `SELECT rangeIdeal, rangeLow, rangeHigh FROM QAA.range_TB WHERE rangeID='${rangeId}'`;
    return makeConnection.sqlQueryExecution(ourQuery, mySqlConfig);
}

module.exports = {
    getTestSummary,
    getTestDetailByTestId,
    getLocation,
    getModels,
    postTestSummary,
    getTestLine,
    postTestline,
    getAllCriteria,
    getRangeValuesForRangeId
}