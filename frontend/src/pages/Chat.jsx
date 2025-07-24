import React, { useState, useEffect, useRef } from 'react';
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { useLocation } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@headlessui/react';
import api from '../api';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');
  const socket = useRef(null);

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
    <Layout heading="Chat">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex flex-col gap-4">
        <div className="max-h-[65vh] overflow-auto border rounded p-4 flex-1">
          {messages.map((msg, idx) => {
            const isCurrentUser = msg.sender.username === localStorage.getItem("username");

            return (
              <div
                key={idx}
                className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-2`}
              >
                <div
                  className={`
                    px-4 py-2 rounded-lg max-w-[70%] 
                    ${isCurrentUser ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}
                  `}
                >
                  <span className="text-sm block mb-1 font-semibold">{msg.sender.username}</span>
                  <span className="break-all">{msg.content}</span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex flex-col w-full gap-2">
          <textarea
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(); }}
            placeholder="Type a message..."
            className="w-full border px-4 py-2 rounded resize-y overflow-hidden"
            style={{ maxHeight: '300px', minHeight: '50px' }}
          />
          <Button
            onClick={sendMessage}
            className="bg-gray-700 text-white px-4 py-2 rounded self-start"
          >
            Send
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Chat;