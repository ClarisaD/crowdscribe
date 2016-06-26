module.exports = function (app) {
  var Request = require('../models/request.js');

  // get JSON showing requests for media given URL.
app.get('/', function(req, res) {
    var requestedURL = req.query.url,
        numRequests = 0;
        // requestedMediaId = Media.find({ url: requestedURL }).id,

        Media.findOne({ 'url' : requestedURL }, function (err, foundMedia) {
          if (err) {
            console.log('There was an error finding by media URL! ' + err);
          } else {
            var mediaID = foundMedia._id;
            var count   = foundMedia.count;

            res.json({ url      : req.query.url,
                       requests : numRequests });
          }
        });
        // numRequests = Request.count({ mediaId: requestedMediaId }); // TODO query here
  });

  // endpoint that saves new request.
  app.post('/', function (req, res) {
    var newMedia    = new Request(req.body.request); // grabs media object created by user.
    var newMediaURL = req.body.url; //
    var newMediaID  = newMedia._id;

    // saves new media object.
    newMedia.save(function (err, media) {
      if (err) {
        res.send(err);
      } else {
        // render the media page, passing in the original
        // url of the media.
        res.render(302, '/media', { 'url' : newMediaURL });
      }
    });
  });
};
