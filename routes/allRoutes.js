var express = require('express');
var router = express.Router();
var path = require('path');

var viewPath = __dirname + '/../public/';


var QAAController=require('./../controller/summary.controller');


router.get('/', function(req, res) {
    res.sendFile(path.resolve(viewPath + 'home.html'));
})


// GET TEST SUMMARY
router.route('/v1/QAA/testData').get(QAAController.gTestSummary);

// WRITE TEST SUMMARY AND RETURNS THE CRITERIA RANGE FOR THE PRODUCT
router.route('/v1/QAA/testData').post(QAAController.pTestSummary);



// GET TEST DETAIL BY TEST CASE ID 
router.route('/v1/QAA/testDetailByID/:testId').get(QAAController.gTestDetailByTestId);

// WRITE TEST LINE 
router.route('/v1/QAA/TestLine').post();


router.route('/v1/QAA/Location').get(QAAController.gLocation);

router.route('/v1/QAA/Models').get(QAAController.gModels);






module.exports = router;