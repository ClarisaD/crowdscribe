var mongoose = require('mongoose')
    , Schema = mongoose.Schema;

var feedbackSchema = Schema({
  userId       : String,
  type         : String,
  transcriptId : String
});

var Feedback   = mongoose.model('Feedback', feedbackSchema);
module.exports = Feedback;
