'use strict';
var bodyParser           = require('body-parser')
    , cookieParser       = require('cookie-parser')
    , dbConfig           = require('./config/db')
    , ejs                = require('ejs')
    , express            = require('express')
    , expressEjsLayouts  = require('express-ejs-layouts')
    , http               = require('http')
    , LocalStrategy      = require('passport-local')
    , mongoose           = require('mongoose')
    , morgan             = require('morgan')
    , methodOverride     = require('method-override')
    , passport           = require('passport')
    , session            = require('express-session');

var app = express();
mongoose.connect(dbConfig.dbUrl);

// Settings for passport.
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

require('./routes')(app, passport);

app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms
app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

app.listen(8080, function () { // starts server. #randomass port.
  console.log('Server started & listening on port 8080, yo!');
});
