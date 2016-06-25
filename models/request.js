var mongoose    = require('mongoose')
    , Schema    = mongoose.Schema;

var requestSchema = Schema({
  user         : String,
  media        : { type : String, default : required },
  time         : { type : Date  , default : Date.now }
});

var Request    = mongoose.model('Request', requestSchema);
module.exports = Request;
