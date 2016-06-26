var express = require('express')
    , Media = require('../models/media.js');
var router = express.Router();

  // load summary page based on URL.
  router.get('/', function (req, res) {
    res.send('hi!')
      // res.render(302, 'media/index', { url : req.query.url });
      // res.json({ url      : req.query.url,
      //            requests : numRequests });
  });

  module.exports = router;
