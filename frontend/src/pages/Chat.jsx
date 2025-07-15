import React, { useState, useEffect, useRef } from 'react';
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { useLocation } from 'react-router-dom';
import api from '../api';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');
  const socket = useRef(null);

  const queryParams = new URLSearchParams(window.location.search);
  // const receiverId = queryParams.get('receiver');
  const location = useLocation();
  const receiverId = location.state.receiverId;
  console.log(receiverId)

  const token = localStorage.getItem(ACCESS_TOKEN);

  useEffect(() => {
    if (!token || !receiverId) return;

    socket.client = new WebSocket(`ws://localhost:8000/ws/chat/${receiverId}/?token=${token}`);

    socket.client.onmessage = (event) => {
      setMessages((prev) => [...prev, JSON.parse(event.data)]);
    };

    socket.client.onclose = () => {
      console.log('WebSocket disconnected');
    };

    async function fetchMessages() {
        try {
          setLoading(true);
          const messagesRes = await api.get(`core/messages/${receiverId}`);
          setMessages(messagesRes.data);
          messages.map(message => console.log(message));
        } catch (error) {
          console.error('Failed to retrieve past messages:', error);
        } finally {
          setLoading(false);
        }
      }
  
      fetchMessages();

    return () => {
      socket.client.close();
    };
  }, []);

  const sendMessage = () => {
    if (input.trim() && socket.client.readyState === WebSocket.OPEN) {
      socket.client.send(JSON.stringify({ message: input }));
      setInput('');
    }
  };
  console.log(messages)
  return (
    <div class="p-5">
      <div>
        {messages.map((msg, idx) => (
          <div key={idx}>
            <strong>{msg.sender.username}</strong>: {msg.content}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(); }}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;