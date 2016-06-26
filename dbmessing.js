// Not part of the actual server, just trying to understand how to do the database work for the server.

'use strict';
var
      dbConfig           = require('./config/db')
    , mongoose           = require('mongoose');


var Feedback   = require('./models/feedback');
var Media      = require('./models/media');
var Request    = require('./models/request');
var Transcript = require('./models/transcript');
var User       = require('./models/user');

mongoose.connect(dbConfig.dbUrl);

console.log('starting')

// XXX untested
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

function tellMeAbout(url, callback) {
    findProgenitor(url, (err, media) => {
        if (err) return callback(err);
        if (media === null) return callback(null, {
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
                            callback(null, {numRequests, transcriptText: pick.transcriptText, transcriptScore: pick.transcriptScore});
                        }
                    });
                });
            });
        });
    });
}

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

function totalScore(feedbacks) {
    const count = feedbacks.length;
    let sum = feedbacks.reduce((accum, feedback) => accum + oneScore(feedback),
                               0);
    return 100 * (0 < count ? sum / count : 0);   // TODO: give more credence when there are more ratings...
}

function oneScore(feedback) {
    switch (feedback.type) {   // XXX I don't really know what we're going to put in feedback.type...
    case '+1': return 1;
    case '-1': return -1;
    case 'spam': return -7;
    default: console.log("Bad feedback.type", feedback); return 0;
    }
}

if (0) {
    var t = new Transcript({
        mediaId: "42",
        content: "Hello world",
        userId:  "Sam Spade",
    });
    t.save(function (err, t2) {
        console.log("I am the save callback");
        if (err) return console.error(err);
        if (t !== t2) console.log("weird");
        console.log("done");
    });
} else if (0) {
    Transcript.find({mediaId: "42"}, function (err, transcripts) {
        if (err) return console.error(err);
        transcripts.forEach(t => {
            console.log("got one", t);
        });
    });
} else {
    tellMeAbout('42', (err, result) => {
        console.log('err', err);
        console.log('result', result);
    });
}


console.log('started');
