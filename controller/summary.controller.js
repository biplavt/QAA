var QAAModel = require('./../model/summary.model');

/***
Function: Returns all the testData Summary present in our system (ie. all test data present (not lines) in our database)
    Called by /v1/QAA/testData
Input: None
Output: Array of Objects {testID,employeeID,EmployeeName, Location, ProductID,QuantityInspected,InspectionDate,Status}
Time Complexity: O(Async)
***/
function gTestDataSummary(req, res) {

    QAAModel.getTestDataSummary().then(function(result) {

        if (typeof result != 'undefined') {

            res.status(200).send(result);
        }

    }).catch(function(error) {

        if(typeof error.sqlMessage!='undefined')
            res.status(400).send({ 'Error': error.sqlMessage });
        else 
            res.status(400).send(error);
    })
}

/***
    Function: Returns all the test lines for particular Test using TestID
        Called by /v1/QAA/testDetailByID/:testID 
    Input: Test ID
    Output: Array of Objects {testID, modelID, workcell, Qty, criteriaName, criteriaID,rangeID, rangeIdeal, rangeLow,rangeHigh,testData,Status, testStatus, Unit}
    Time Complexity: O(Async) + C, C=number of testlines for a particular testID (usually 4)
***/
function gTestDetailByTestId(req, res) {
    var testDetail = [];

    QAAModel.getTestDetailByTestId(req.params.testId).then(function(result) {
        if (typeof result != 'undefined') {

            result.forEach(function(test) {

                testDetail.push({
                    testID: test.testID,
                    modelID: test.modelID,
                    workCell: test.workCell,
                    Qty: test.QuantityInspected,
                    criteriaName: test.criteriaName,
                    criteriaID: test.criteriaID,
                    rangeID: test.rangeID,
                    rangeIdeal: test.rangeIdeal,
                    rangeLow: test.rangeLow,
                    rangeHigh: test.rangeHigh,
                    testData: test.testData,
                    Status: test.Status,
                    testStatus: test.testStatus,
                    Unit: test.Unit
                })

            })
        }
        return QAAModel.getTestDataSummaryByTestId(req.params.testId);
    })
    .then(function(result){
        res.send({
            testData:testDetail,
            OverallTestStatus:result[0].verified
        });
    })
    .catch(function(error) {
        if(typeof error.sqlMessage!='undefined')
            res.status(400).send({ 'Error': error.sqlMessage });
        else 
            res.status(400).send(error);
    })
}

/***
    Function: Returns all the test lines for particular Test using TestID
        Called by /v1/QAA/testDetailByID/:testID 
    Input: Test ID
    Output: Array of Objects {testID, modelID, workcell, Qty, criteriaName, criteriaID,rangeID, rangeIdeal, rangeLow,rangeHigh,testData,Status, testStatus, Unit}
    Time Complexity: O(Async) + C, C=number of testlines for a particular testID (usually 4)
***/
function gTestLine(testCaseID) {

    return new Promise(function(resolve, reject) {

        QAAModel.getTestLine(testCaseID).then(function(result) {

            let testDetail = [];

            if (typeof result != 'undefined') {

                result.forEach(function(test) {

                    testDetail.push({

                        TestCase: test.testID,
                        ProductID: test.modelID,
                        criteriaID: test.criteriaID,
                        Criteria: test.criteriaName,
                        rangeID: test.rangeID,
                        rangeIdeal: test.rangeIdeal,
                        rLow: test.rangeLow,
                        rHigh: test.rangeHigh

                    });
                })
                resolve(testDetail);
            } else {
                reject('error');
            }
        })
    })
}

/***
    Function: Posts the test data summary in request body 
        Called by POST /v1/QAA/testData
    Input: new test body
    Output: Returns the test line related to this particular testID
    Time Complexity: O(Async) + C, C=number of testlines for a particular testID (usually 4)
***/
function pTestDataSummary(req, res) {
    let newTest = req.body.testData;
    //first post the test summary
    QAAModel.postTestDataSummary(newTest).then(function(result) {
        if (result) {
            return (result.insertId);
        } else {
            throw new Error('Insert Failed');
        }
    //then extract all test line related to that testID, and add testData and testStatus to it 
    }).then(function(insertID) {
        let testID = JSON.stringify(insertID, undefined, 2);
        QAAModel.getTestLine(insertID).then(function(criteria) {
            if (criteria != []) {
                criteria.forEach(function(cri) {
                    cri.testData = 0
                    cri.testStatus = 0
                })
                res.send(criteria)
            } else {
                res.status(400).send({ 'Error': 'No test Detail Found' });
            }
        })
    }).catch(function(error) {
        if(typeof error.sqlMessage!='undefined')
            res.status(400).send({ 'Error': error.sqlMessage });
        else 
            res.status(400).send(error);
    })
}

/***
    Function: Posts the test lines present in request body (upserts it as of now)
        Called by POST /v1/QAA/testLine
    Input: new test lines
    Output: returns the insert result from mysql (fieldcount, insertID,affectedRows,warning count,message, protocol141,changedRows)
    Time Complexity: O(Async) 
***/
function pTestLine(req, res) {
    let newTest = req.body;
    QAAModel.postTestline(newTest).then(function(result) {
        if (typeof result != "undefined") {
            res.send(result);
        }

    }).catch(function(error) {
        if(typeof error.sqlMessage!='undefined')
            res.status(400).send({ 'Error': error.sqlMessage });
        else 
            res.status(400).send(error);
    })
}

/***
    Function: Gets all the available location (as of now, only one location, i.e sparks)
        Called by GET /v1/QAA/Location
    Input: None
    Output: returns the locations with id (locationID, locationName)
    Time Complexity: O(Async) 
***/
function gLocation(req, res) {

    QAAModel.getLocation().then(function(result) {
        // console.log('result:',result);
        if (typeof result != 'undefined') {

            res.send(result);
        } else {
            throw new Error('Error: No location Found');
        }
    }).catch(function(error) {
        if(typeof error.sqlMessage!='undefined')
            res.status(400).send({ 'Error': error.sqlMessage });
        else 
            res.status(400).send(error);    
    })
}

/***
    Function: Gets all the available models 
        Called by GET /v1/QAA/Models
    Input: None
    Output: returns the locations with id (modelID, modelName)
    Time Complexity: O(Async) 
***/
function gModels(req, res) {
    QAAModel.getModels().then(function(result) {
        if (typeof result != 'undefined') {
            res.send(result);
        }
    }).catch(function(error) {
        if(typeof error.sqlMessage!='undefined')
            res.status(400).send({ 'Error': error.sqlMessage });
        else 
            res.status(400).send(error);  
    })
}


/***
    Function: Gets all the quality inspection criteria 
        Called by GET /v1/QAA/allCriteria
    Input: None
    Output: returns the locations with id (criteriaID, criteriaName)
    Time Complexity: O(Async) 
***/
function gAllCriteria(req, res) {
    QAAModel.getAllCriteria().then(function(result) {
        if (typeof result != 'undefined') {
            res.send(result);
        }
    }).catch(function(error) {
        if(typeof error.sqlMessage!='undefined')
            res.status(400).send({ 'Error': error.sqlMessage });
        else 
            res.status(400).send(error);
    })
}


/***
    Function: Gets all the quality inspection criteria 
        Called by GET /v1/QAA/rangeValuesForRangeID/:rangeID
    Input: rangeID
    Output: returns the range values for this rangeID (rangeIdeal, rangeLow, rangeHigh)
    Time Complexity: O(Async) 
***/
function gRangeValuesForRangeId(req, res) {
    QAAModel.getRangeValuesForRangeId(req.params.rangeId).then(function(result) {
        if (typeof result != 'undefined') {

            res.send(result);
        }
    }).catch(function(error) {
        if(typeof error.sqlMessage!='undefined')
            res.status(400).send({ 'Error': error.sqlMessage });
        else 
            res.status(400).send(error);
    })
}


/***
    Function: Gets all the users 
        Called by GET /v1/QAA/Users
    Input: None
    Output: returns the list of users (employeeID, name)
    Time Complexity: O(Async) 
***/
function gUsers(req, res) {
    QAAModel.getUsers().then(function(result) {
        if (typeof result != 'undefined') {
            res.send(result);
        }
    }).catch(function(error) {
        if(typeof error.sqlMessage!='undefined')
            res.status(400).send({ 'Error': error.sqlMessage });
        else 
            res.status(400).send(error);
    })
}


/***
    Function: Gets the roles of a user (imported by WebApp)
        Called by GET /v1/QAA/rolesByEmail/:emailId
    Input: emailId
    Output: returns the list of roles of users (<roles>)
    Time Complexity: O(Async + n) ; n=number of roles 
***/
function gRolesByEmail(req, res) {

    QAAModel.getRolesByEmail(req.params.email).then(function (result) {

        if (typeof result[0] != 'undefined') {

            var resultArray = [];
            result.forEach(function (data) {
                resultArray.push(data.role);
            })

            res.status(200).send(resultArray);

        } else {

            res.status(200).send([]);

        }

    }).catch(function (error) {
        if(typeof error.sqlMessage!='undefined')
            res.status(400).send({ 'Error': error.sqlMessage });
        else 
            res.status(400).send(error);
    })
}

module.exports = {
    gTestDataSummary,
    gTestDetailByTestId,
    pTestDataSummary,
    gLocation,
    gModels,
    gTestLine,
    pTestLine,
    gAllCriteria,
    gRangeValuesForRangeId,
    gUsers,
    gRolesByEmail
}