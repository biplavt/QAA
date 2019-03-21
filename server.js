var express = require('express');
var app = express();
var mysql=require('mysql');
const bodyParser=require('body-parser');

const PORT = process.env.PORT || 3060;

app.use(bodyParser.json());


app.use(require('./routes/allRoutes'),function(req,res,next){
	next();
});


app.listen(PORT, function() {
    console.log(`Server started at ${PORT}...`);
})