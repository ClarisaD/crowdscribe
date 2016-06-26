'use strict';
var bodyParser           = require('body-parser')
    , cookieParser       = require('cookie-parser')
    , dbConfig           = require('./config/db')
    , ejs                = require('ejs')
    , express            = require('express')
    , expressEjsLayouts  = require('express-ejs-layouts')
    , flash              = require('connect-flash')
    , http               = require('http')
    , LocalStrategy      = require('passport-local')
    , mongoose           = require('mongoose')
    , morgan             = require('morgan')
    , methodOverride     = require('method-override')
    , passport           = require('passport')
    , session            = require('express-session');

var app = express();
var router = express.Router();
var server = http.createServer(app);

mongoose.connect(dbConfig.dbUrl);
require('./config/passport')(passport);

// Settings for passport.
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

// define routes
var passportRoutes    = require('./routes')(app, passport);
var mediaController   = require('./controllers/medias');
var requestController = require('./controllers/requests');

// shows what's in req.whatevers.
app.use(function (req, res, next) {
  console.log("======== REQ START =========");
  console.log("REQ DOT BODY\n", req.body);
  console.log("REQ DOT PARAMS\n", req.params);
  console.log("REQ DOT SESSION\n", req.session);
  console.log("REQ DOT USER\n", req.user);
  console.log("======== REQ END =========");
  next();
});


app.use('/media', mediaController);
app.use('/request', requestController);
app.use(express.static('./static')); // adds a static area for images and stuff.
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms
app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash());

// CATCHALL ROUTE (404)
app.use(function (req, res, next) {
  res.send("Something went wrong. Couldn't find what you were looking for.");
  res.end();
});

app.listen(8080, function () { // starts server. #randomass port.
  console.log('Server started & listening on port 8080, yo!');
});
