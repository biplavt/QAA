var express = require('express');
var app = express();
var mysql=require('mysql');
const bodyParser=require('body-parser');q
var cors = require('cors');

const PORT = process.env.PORT || 3060;

app.use(bodyParser.json());




var originsWhitelist = [
    'http://localhost:4200' //this is my front-end url for development
    //, 'http://www.myproductionurl.com'
];
var corsOptions = {
    origin: function(origin, callback) {
        var isWhitelisted = originsWhitelist.indexOf(origin) !== -1;
        callback(null, isWhitelisted);
    },
    credentials: true
}
//here is the magic
app.use(cors(corsOptions));

// app.use(cors());
app.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    next();
});


app.use(require('./routes/allRoutes'),function(req,res,next){
	next();
});

app.listen(PORT, function() {
    console.log(`Server started at ${PORT}...`);
})