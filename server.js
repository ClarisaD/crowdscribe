'use strict';
var bodyParser           = require('body-parser')
    , ejs                = require('ejs')
    , express            = require('express')
    , expressEjsLayouts  = require('express-ejs-layouts')
    , http               = require('http')
    , LocalStrategy      = require('passport-local')
    , mongoose           = require('mongoose')
    , methodOverride     = require('method-override')
    , passport           = require('passport');

var app = express();

app.get('/', function (req, res) {
  res.send('Hi!!!');
});

app.listen(4000, function () {
  console.log('Server started & listening on port 4000, yo!');
});
