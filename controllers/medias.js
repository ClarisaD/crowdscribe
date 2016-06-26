module.exports = function(app, passport) {

  var Media = require('../models/media.js')

  app.use(morgan('dev'));

  // load summary page based on URL
  app.get('/', function (req, res) {
      res.render('/media/index', { url: req.query.url })
  });

  app.post('/', function (req, res) {
    var newMedia    = new Media(req.body.media);
    var newMediaURL = req.body.url;
    var newMediaID  = newMedia._id;

    newMedia.save(function (err, media) {
      if (err) {
        res.send(err);
      } else {
        res.render(302, '/');
      }
    });
  });
}
