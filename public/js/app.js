Chat = Ember.Application.create();

Chat.IndexRoute = Ember.Route.extend({
  model: function () {
    return Ember.$.ajax('/messages');
  },
  setupController: function (controller, model) {
    var sock = SockJS('/new-messages');
    sock.onmessage = function (message) {
      message = JSON.parse(message.data);
      controller.onMessage(message);
    };
    return this._super(controller, model);
  }
});

Chat.storeLocally = function (key, value) {
  try {
    window.localStorage[key] = value;
  } catch(e) {}
};
Chat.getLocally = function (key) {
  try {
    return window.localStorage[key];
  } catch(e) {}
}

Chat.IndexController = Ember.ArrayController.extend({
  newMessage: null,
  nickname: Chat.getLocally('nickname'),

  onMessage: function (message) {
    this.pushObject(message);
  },

  saveNickname: function () {
    var nickname = this.get('nickname');
    Chat.storeLocally('nickname', nickname);
  }.observes('nickname'),

  lastMessages: function () {
    var maxLength = 15;
    var length = this.get('length');
    if (length < maxLength) return this;
    return this.slice(length - maxLength);
  }.property('length'),

  actions: {
    postMessage: function () {
      var message = this.get('newMessage');
      if(!message) return;

      var json = {
        author: this.get('nickname') || 'anonymous',
        body: message
      };
      Ember.$.ajax('/messages', {
        type: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        data: JSON.stringify(json)
      });
      this.set('newMessage', null);
    }
  }
});
