var express = require('express');
var app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());


var cors = require('cors');
var {corsfunction, corsOptions} =require('./cors.server.js');
app.use(cors(corsOptions));
app.use(corsfunction);

const PORT = process.env.PORT || 3060;


app.use(require('../routes/allRoutes'), function(req, res, next) {
    next();
});


app.listen(PORT, function() {
    console.log(`Server started at ${PORT}...`);
})
