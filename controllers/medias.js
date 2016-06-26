module.exports = function(app, passport) {

  var Media = require('../models/media.js');

  // load summary page based on URL.
  app.get('/', function (req, res) {
      res.render('/media/index', { url : req.query.url });
      res.json({ url      : req.query.url,
                 requests : numRequests });
  });
};
