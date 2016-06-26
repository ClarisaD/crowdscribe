module.exports = function (app) {
  var Request = require('../models/request.js');

  // endpoint that saves new request.
  app.post('/', function (req, res) {
    var newMedia    = new Request(req.body.request); // grabs media object created by user.
    var newMediaURL = req.body.url; //
    var newMediaID  = newMedia._id;

    newMedia.save(function (err, media) {
      if (err) {
        res.send(err);
      } else {
        res.render(302, '/media', { 'url' : newMediaURL });
      }
    });
  });
};
