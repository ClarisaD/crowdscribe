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

function tellMeAbout(url, callback) {
    Request.find({media: url}, (err, requests) => {
        if (err) return callback(err);

        // (this is probably wrong in that mediaId is not the url?)
        // - Yeah, you have to ping the db to get the mediaId. - Stan

        Transcript.find({mediaId: url}, (err, transcripts) => {
            if (err) return callback(err);
            let nTranscripts = transcripts.length;

            // I don't quite understand what you're doing here.
            // You are making an array that stores all the
            // transcript objects for later referral? - Stan

            const transcriptInfo = new Map();
            transcripts.forEach(transcript => {
                const transcriptId = transcript.mediaId + ',' + transcript.userId; // XXX or what?
                Feedback.find({transcriptId: transcriptId}, (err, feedbacks) => {
                    if (err) return callback(err);
                    transcriptInfo.set(transcriptId, feedbacks);
                    --nTranscripts;
                    if (nTranscripts === 0) {
                        callback(null, {requests, transcriptInfo});
                    }
                });
            });
        });
    });
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


console.log('started')
