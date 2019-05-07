var QAAModel = require('./../model/summary.model');

/***
Function: Returns all the testData Summary present in our system 
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
    }).then(function(result){
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

function pTestDataSummary(req, res) {
    let newTest = req.body.testData;

    QAAModel.postTestDataSummary(newTest).then(function(result) {
        // console.log('result1:', result);
        if (result) {
            // console.log('insertId:', result.insertId)
            return (result.insertId);
        } else {
            throw new Error('Insert Failed');
        }

    }).then(function(insertID) {
        let testID = JSON.stringify(insertID, undefined, 2);
        // console.log('testID:', testID);
        QAAModel.getTestLine(insertID).then(function(criteria) {
            if (criteria != []) {
                // res.send(criteria);
                criteria.forEach(function(cri) {
                    cri.testData = 0
                    cri.testStatus = 0
                })
                res.send(criteria)
            } else {
                res.status(400).send({ 'err': 'No test Detail Found' });
            }
        })
    }).catch(function(error) {
        res.status(400).send({ 'Error': error.sqlMessage });
    })
}

function pTestLine(req, res) {
    let newTest = req.body.testData;
    QAAModel.postTestline(newTest).then(function(result) {
        if (typeof result != "undefined") {
            res.send(result);
        }

    }).catch(function(error) {
        res.status(400).send(error);
    })
}

function gLocation(req, res) {
    QAAModel.getLocation().then(function(result) {
        // console.log('result:',result);
        if (typeof result != 'undefined') {

            res.send(result);
        } else {
            throw new Error('Insert Failed');
        }
    }).catch(function(error) {
        res.status(400).send(error);
    })
}

function gModels(req, res) {
    QAAModel.getModels().then(function(result) {
        if (typeof result != 'undefined') {
            res.send(result);
        }
    }).catch(function(error) {
        res.status(400).send(error);
    })
}

function gAllCriteria(req, res) {
    QAAModel.getAllCriteria().then(function(result) {
        if (typeof result != 'undefined') {
            res.send(result);
        }
    }).catch(function(error) {
        res.status(400).send(error);
    })
}

function gRangeValuesForRangeId(req, res) {
    QAAModel.getRangeValuesForRangeId(req.params.rangeId).then(function(result) {
        if (typeof result != 'undefined') {

            res.send(result);
        }
    }).catch(function(error) {
        res.status(400).send(error);
    })
}

function gUsers(req, res) {
    QAAModel.getUsers().then(function(result) {
        if (typeof result != 'undefined') {
            res.send(result);
        }
    }).catch(function(error) {
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
    gUsers
}