const express = require('express');
const router = express.Router();
const path = require('path');

const viewPath = __dirname + '/../public/';


const QAAController = require('./../controller/summary.controller');


router.get('/', function(req, res) {
    // res.sendFile(path.resolve(viewPath + 'home.html'));
    res.send( ["Elie", "Matt", "Joel", "Michael"]);
})


// GET TEST SUMMARY
router.route('/v1/QAA/testData').get(QAAController.gTestDataSummary);

// WRITE TEST SUMMARY AND RETURNS THE CRITERIA RANGE FOR THE PRODUCT
router.route('/v1/QAA/testData').post(QAAController.pTestDataSummary);



// GET TEST DETAIL BY TEST CASE ID 
router.route('/v1/QAA/testDetailByID/:testId').get(QAAController.gTestDetailByTestId);

// WRITE TEST LINE 
router.route('/v1/QAA/TestLine').post(QAAController.pTestLine);


router.route('/v1/QAA/Location').get(QAAController.gLocation);

router.route('/v1/QAA/Models').get(QAAController.gModels);

router.route('/v1/QAA/allCriteria').get(QAAController.gAllCriteria);

router.route('/v1/QAA/rangeValuesForRangeID/:rangeId').get(QAAController.gRangeValuesForRangeId);

router.route('/v1/QAA/Users').get(QAAController.gUsers);

router.route('/v1/WA/rolesByEmail/:email').get(QAAController.gRolesByEmail);




module.exports = router;