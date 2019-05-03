var mySqlConfig = require('./../configuration/prodDatabase.config.js');
var makeConnection = require('./utility/utilityModel.js');


function getTestSummary() {

    var ourQuery = `SELECT testID, employeeID, EmployeeName, Location, ProductID, Product, QuantityInspected, 
		Date_Format(InspectionDate, '%m-%d-%Y') as InspectionDate, Status FROM QAA.TestSummary`;

    return makeConnection.sqlQueryExecution(ourQuery, mySqlConfig);
}

function getTestDetailByTestId(testCaseID) {
    var ourQuery = `select testID, modelID, workCell,  QuantityInspected, criteriaName, criteriaID,rangeID, rangeIdeal, rangeLow, rangeHigh,testData, Status,testStatus
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
    // console.log(values);

    var ourQuery = `Insert into QAA.testData_TB (employeeID, locationID, modelID,Qty,verified) values ('${input.employeeID}',${input.locationID},'${input.modelID}',${input.Qty},0)`;
    // console.log(ourQuery);
    return makeConnection.sqlQueryExecution(ourQuery, mySqlConfig);
}


function postTestline(input) {
    let bulkInsertValues = [];
    // console.log('input:',input);

    let testStatus=true;
        input.forEach(function(testLine){
            testStatus=testStatus && testLine.testStatus
        })
        
        // console.log('testStatus:',testStatus);


    input.forEach(criteria => {

        let values = Object.keys(criteria).map(function(_) { return criteria[_]; })

        bulkInsertValues.push(values);

    });

    var newUpdateQuery=`UPDATE QAA.testData_TB SET verified = ${testStatus} WHERE testID= ${input[0].TestCase}`
    // console.log('newUpdateQuery:',newUpdateQuery);

    var ourQuery = `Insert into QAA.testLineData_TB (testID, criteriaID, rangeID,testData,verified) values ?`;

    return new Promise(function(resolve, reject){
        makeConnection.sqlQueryExecution(ourQuery, mySqlConfig, bulkInsertValues).then(function(result){
            // console.log('newUpdateQuery:',newUpdateQuery);
            return makeConnection.sqlQueryExecution(newUpdateQuery, mySqlConfig);
        }).then(function(result){
            resolve(result);
        },function(error){
            reject(error);
        })
    })
    
    

}

function getTestLine(testCaseID) {
    // console.log('testCaseID:',testCaseID);
    var ourQuery = `select * from QAA.testLine where testID = ${testCaseID}`;
    return makeConnection.sqlQueryExecution(ourQuery, mySqlConfig);
}

function getAllCriteria() {
    var ourQuery = 'SELECT criteriaID, criteriaName FROM QAA.criteria_TB';
    return makeConnection.sqlQueryExecution(ourQuery, mySqlConfig);
}

function getRangeValuesForRangeId(rangeId) {
    var ourQuery = `SELECT rangeIdeal, rangeLow, rangeHigh FROM QAA.range_TB WHERE rangeID='${rangeId}'`;
    return makeConnection.sqlQueryExecution(ourQuery, mySqlConfig);
}

function getUsers(){
    var ourQuery= 'SELECT employeeID, name FROM QAA.user_TB';
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
    getRangeValuesForRangeId,
    getUsers
}