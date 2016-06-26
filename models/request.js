'use strict';

var mongoose    = require('mongoose')
    , Schema    = mongoose.Schema;

var requestSchema = Schema({
  user    : String,
  url     : String,
  mediaId : { type : String, default : mongoose.required },
  time    : { type : Date  , default : Date.now }
});

var Request    = mongoose.model('Request', requestSchema);
module.exports = Request;
