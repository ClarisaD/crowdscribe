var mongoose = require('mongoose')
    , Schema = mongoose.Schema;

var mediaSchema = Schema({
  url      : { type : String, default : mongoose.required },
  id       : String,
  type     : String,
  parentId : String
});

var Media      = mongoose.model('Media', mediaSchema);
module.exports = Media;
