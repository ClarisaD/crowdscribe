'use strict';

var mongoose = require('mongoose')
    , Schema = mongoose.Schema;

var transcriptSchema = Schema({
  mediaId : String,
  content : String,
  userId  : String
});

var Transcript = mongoose.model('Transcript', transcriptSchema);
module.exports = Transcript;
