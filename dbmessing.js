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

function tellMeAbout(url, callback) {
    // is this how the schema is meant to work?

    // * So I don't think you can compare the media and url directly
    // bc media is an object that contains a url value so
    // if you wanna look for all requests containing the url that was
    // passed into the function like you
    // did here, you would have to compare via
    // Request.find{ media.url: url }.
    // but we actually have requests associated with media objs
    // by their db id values, not by url. what if you had 2 urls
    // that contained the same media that your wanted to contribute
    // transcription or a summary to? by associating it by ids only,
    // it's much more specific, if that makes sense? - Stan


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
