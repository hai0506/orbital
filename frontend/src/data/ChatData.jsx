const ChatData = [
  {
    "me": {
      "username": "alice",
      "email": "alice@example.com"
    },
    "other": {
      "username": "bob",
      "email": "bob@example.com"
    },
    "chat_history": [
      {
        "sender": "alice",
        "receiver": "bob",
        "content": "Hey Bob, are you free this weekend?",
        "time_created": "2025-07-22T23:10:00",
        "read": false
      },
      {
        "sender": "bob",
        "receiver": "alice",
        "content": "Yeah, I am. What's up?",
        "time_created": "2025-07-22T23:12:00",
        "read": false
      },
      {
        "sender": "alice",
        "receiver": "bob",
        "content": "Thinking of visiting the booth together.",
        "time_created": "2025-07-22T23:15:00",
        "read": false
      }
    ],
    "received": false,
    "preview": "Thinking of visiting the boot..."
  },
  {
    "me": {
      "username": "bob",
      "email": "bob@example.com"
    },
    "other": {
      "username": "org1",
      "email": "org@example.com"
    },
    "chat_history": [
      {
        "sender": "org1",
        "receiver": "bob",
        "content": "Please send the updated invoice.",
        "time_created": "2025-07-22T22:50:00",
        "read": false
      },
      {
        "sender": "bob",
        "receiver": "org1",
        "content": "Just sent it over. Please check.",
        "time_created": "2025-07-22T22:55:00",
        "read": false
      },
      {
        "sender": "org1",
        "receiver": "bob",
        "content": "Received, thanks!",
        "time_created": "2025-07-22T23:00:00",
        "read": false
      }
    ],
    "received": true,
    "preview": "Received, thanks!"
  }
];

export default ChatData;
