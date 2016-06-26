'use strict';

var express      = require('express')
    , Feedback   = require('../models/feedback.js')
    , Media      = require('../models/media.js')
    , Transcript = require('../models/transcript.js');

var router = express.Router();

// load summary page based on URL.
router.get('/', function (req, res) {
  res.render('media/index', { url : req.query.url });
});

router.get('/json', function (req, res) {
  var url = req.query.url;
  tellMeAbout(url, urlInfo => {
    // TODO: return real data here from urlInfo
    // res.json(urlInfo);
    res.json({ url      : url,
               numRequests : 0,
               transcriptText: "This is the dummy transcript",
               transcriptScore: 100 });
  });
});

function tellMeAbout(url, callback) {
  findProgenitor(url, (err, media) => {
    if (err) return callback(err);
    if (media === null) return callback(null, {
      url: url,
      numRequests: 0,
      transcriptText: null,
      transcriptScore: 0,
    });
    Request.count({media: media.mediaId}, (err, numRequests) => {
      if (err) return callback(err);
      Transcript.find({mediaId: media.mediaId}, (err, transcripts) => {
        if (err) return callback(err);
        let nRemainingTranscripts = transcripts.length;
        const transcriptInfo = new Map();
        transcripts.forEach(transcript => {
          Feedback.find({transcriptId: transcript._id}, (err, feedbacks) => {
            if (err) return callback(err);
            transcriptInfo.set(transcriptId, {transcript, feedbacks});
            --nRemainingTranscripts;
            if (nRemainingTranscripts === 0) {
              const pick = pickATranscript(transcriptInfo);
              callback(null, {url, numRequests,
                              transcriptText: pick.transcriptText,
                              transcriptScore: pick.transcriptScore});
            }
          });
        });
      });
    });
  });
}

// Call callback with the media record best representing url.
function findProgenitor(url, callback) {
  function climbTheFamilyTree(err, media) {
    console.log("climbing", err, media);
    if (err) return callback(err);
    if (media === null) {
      return callback(null, null);
    } else if (media.parentId === null) {  // XXX or should we check for "" instead?
      // We have a progenitor.
      return callback(null, media);
    } else {
      // Maybe we could assume the immediate parent is as far
      // back as the ancestry goes? But here I'm not making that
      // assumption.
      Media.findOne({mediaId: media.parentId}, climbTheFamilyTree);
    }
  }
  console.log('starting the climb', url);
  Media.findOne({url: url}, climbTheFamilyTree);
}

// Return text and score of the 'best' transcript in the map.
function pickATranscript(transcriptMap) {
  var bestScore, bestText;
  transcriptMap.forEach((id, value) => {
    const transcript = value.transcript;
    const feedbacks = value.feedbacks;
    const score = totalScore(feedbacks);
    if (bestScore === void 0 || bestScore < score) {
      bestScore = score;
      bestText = transcript.content;
    }
  });
  return {transcriptText: bestText,
          transcriptScore: bestScore};
}

// Given an array of feedback records, return a numerical overall score (higher is better).
function totalScore(feedbacks) {
  const count = feedbacks.length;
  let sum = feedbacks.reduce((accum, feedback) => accum + oneScore(feedback),
                             0);
  return 100 * (0 < count ? sum / count : 0);   // TODO: give more credence when there are more ratings...
}

// Score a single feedback record.
function oneScore(feedback) {
  switch (feedback.type) {   // XXX I don't really know what we're going to put in feedback.type...
  case '+1': return 1;
  case '-1': return -1;
  case 'spam': return -7;
  default: console.log("Bad feedback.type", feedback); return 0;
  }
}

module.exports = router;
