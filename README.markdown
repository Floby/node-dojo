WARNING !!
Tests have been refactored to follow the DRY principle.
Your app now needs a `reset(callback)` method to clear the current state of
the server.

Additionnaly, you'll be writing your first REST endpoint.
Your server now must accept these methods

GET /messages -> a list of recorded messages
POST /messages -> record a new message

A message is just a JSON object like this `{author: 'Me', body: 'What I just said'}`
But that you could have guessed reading the new test in the *test* directory

Do whatever's needed to make the test suite pass

You may need to read this:

  * http://expressjs.com/api.html

