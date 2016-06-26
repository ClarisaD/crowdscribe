var express = require('express')
    , Media = require('../models/media.js');

var router = express.Router();

// load summary page based on URL.
router.get('/', function (req, res) {
  res.render('media/index', { url : req.query.url });
});

router.get('/json', function (req, res) {
  var url = req.query.url;

  function findProgenitor(url, callback) {
      function climbTheFamilyTree(err, media) {
          if (err) return callback(err);
          if (media.parentId === null) {  // XXX or should we check for "" instead?
              // We have a progenitor.
              return callback(null, media);
          } else {
              // Maybe we could assume the immediate parent is as far
              // back as the ancestry goes? But here I'm not making that
              // assumption.
              Media.findOne({mediaId: media.parentId}, climbTheFamilyTree);
          }
      }
      Media.findOne({url: url}, climbTheFamilyTree);
  }

  // TODO: return real data here
  res.json({ url      : req.query.url,
           numRequests : 0,
           transcriptText: "This is the dummy transcript",
           transcriptScore: 100 });

});

module.exports = router;
