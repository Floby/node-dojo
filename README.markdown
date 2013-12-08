We're now really talking peer to peer

We want to be able to spin up to instances of our app
and have them synchronized together

We'll do it manually at first by calling a method `startSync(port, host)`
to have an instance start synchronizing with another instance

Since these are long-lived connections, you should make sure your `stop()`
method kills these or else it won't ever close because it waits for existing
connections to end.

As always, do whatever's needed to make the test suite pass.
