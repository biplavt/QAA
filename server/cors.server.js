var cors = require('cors');

var originsWhitelist = [
    'http://localhost:4200' //this is my front-end url for development
    ,'https://haws-corporation.herokuapp.com'
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
