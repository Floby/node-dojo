Now, it's ok to run a chat app locally. It's still better to have
people to talk with.

I could tell you to just push your app on Heroku, but that's
so trivial that I'm not even gonna give you the link for the docs >:]

However, I can suggest you port your application to a peer-to-peer
architecture. Wouldn't that be awesome?

First step is to allow replication of your data model by other peers.
Luckily, you only manage an append-only list of messages. That shouldn't
be too much work.

Use `scuttlebutt` and more specifically `append-only` to replicate
your data structure with peer connecting on a specified port

Do whatever's needed to make this test suite pass ;)
that might be a little more work than usual

You probably should have a look at these:

  * https://github.com/dominictarr/scuttlebutt
  * https://github.com/Raynos/append-only
  * http://nodejs.org/api/net.html

