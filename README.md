# Crowdscribe
---

Crowdscribe is a proof of concept from Open Audio Weekend at NYPL (June 25-26, 2016) for a Chrome extension that supports crowdsourced transcriptions. While on a webpage, users can request transcriptions of media using the extension, and users who are on the same page at the same time will get a notification to help transcribe media on the page.

## How to try it out

There are two parts: a Chrome extension and a server.

To run the server:

  * Install MongoDB and start it running from this directory with `mongod`.
  * `npm install` to install our dependencies.
  * `node server.js` to start the server.
  * For the demo we'll make the server available via ngrok.io; ultimately it ought to live on some host like Heroku.

To run the client:

  * Use Chrome
  * XXX how to install the extension?
  * navigate to a page of interest, and ... XXX

## Collaborators

- Darius Bacon (@abecedarius)
- Clarisa Diaz (@clarii_d)
- Joanna S. Kao (@joannaskao)
- Stanley Sakai (@stanographer)

## License

(License: MIT)
