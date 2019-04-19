var QAAModel = require('./../model/summary.model');


function gTestSummary(req, res) {
    QAAModel.getTestSummary().then(function(result) {

        if (typeof result != 'undefined') {
            res.status(200).send(result);
        }

    }).catch(function(error) {
        res.status(400).send(error);
    })
}

function gTestDetailByTestId(req, res) {
    var testDetail = [];
    QAAModel.getTestDetailByTestId(req.params.testId).then(function(result) {
        // console.log('result:',result);
        if (typeof result != 'undefined') {
            // res.status(200).send(result);
            result.forEach(function(test) {
                testDetail.push({
                    TestCase: test.testID,
                    ProductID: test.modelID,
                    WorkCell: test.workCell,
                    Qty: test.QuantityInspected,
                    Criteria: test.criteriaName,
                    Ideal: test.rangeIdeal,
                    rLow: test.rangeLow,
                    rHigh: test.rangeHigh,
                    Actual: test.testData,
                    Status: test.Status,

                })
            })
            res.send(testDetail);
        }
    }).catch(function(error) {
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
                        Ideal: test.rangeIdeal,
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

function pTestSummary(req, res) {
    let newTest = req.body.testData;
    // console.log('req.body:',req.body);
    // console.log('req.body.testData:',req.body.testData);
    // res.send(JSON.stringify(req));
    QAAModel.postTestSummary(newTest).then(function(result) {
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
                res.send(criteria);
            } else {
                res.status(400).send({ 'err': 'No test Detail Found' });
            }
        })
    }).catch(function(error) {
        res.status(400).send(error);
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
            // res.send({
            //                  insertID : result.insertId,
            //                  serverStatus : result.serverStatus,
            //                  message : result.message,
            //                  apiStatus : 1
            //              });
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

function gUsers(req,res){
    QAAModel.getUsers().then(function(result) {
        if (typeof result != 'undefined') {
            res.send(result);
        }
    }).catch(function(error) {
        res.status(400).send(error);
    })
}

module.exports = {
    gTestSummary,
    gTestDetailByTestId,
    pTestSummary,
    gLocation,
    gModels,
    gTestLine,
    pTestLine,
    gAllCriteria,
    gRangeValuesForRangeId,
    gUsers
}