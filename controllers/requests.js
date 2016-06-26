'use strict';

var bodyParser = require('body-parser')
    , express = require('express')
    , Request = require('../models/request.js');

var router = express.Router();
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });
router.use(bodyParser.json())

  // get JSON showing requests for media given URL.
  router.get('/', function(req, res) {
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

  router.get('/new', function (req, res) {
    res.render('request/new');
  });

  // endpoint that saves new request.
  router.post('/', jsonParser, function (req, res) {
    var reqParams     = req.body.request;
    var newRequest    = new Request(reqParams); // grabs media object created by user.
    console.log(reqParams);
    console.log(newRequest);
    var newRequestURL = req.body.url; //
    var newRequestID  = newRequest._id;

    // saves new media object.
    newRequest.save(function (err, media) {
      if (err) {
        res.send(err);
      } else {
        // render the media json given a URL
        res.status(302);
      }
    });
  });

module.exports = router;
