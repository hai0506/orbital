import React, { useState, useEffect, useRef } from 'react';
import { ACCESS_TOKEN } from "@/constants";
import { useLocation } from 'react-router-dom';
import Layout from '@/shared/Layout';
import { Send } from "lucide-react";
import api from '@/api';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');
  const socket = useRef(null);
  const bottomRef = useRef(null);

  const location = useLocation();
  const receiverId = location.state.receiverId;
  const token = localStorage.getItem(ACCESS_TOKEN);
  const myUsername = localStorage.getItem("username");

  useEffect(() => {
    if (!token || !receiverId) return;

    let cancelled = false;
    const ws = new WebSocket(`ws://localhost:8000/ws/chat/${receiverId}/?token=${token}`);
    socket.client = ws;

    ws.onopen = () => { if (cancelled) ws.close(); };
    ws.onmessage = (event) => { setMessages((prev) => [...prev, JSON.parse(event.data)]); };
    ws.onclose = () => { if (!cancelled) console.log('WebSocket disconnected'); };

    async function fetchMessages() {
      try {
        setLoading(true);
        const messagesRes = await api.get(`core/messages/${receiverId}`);
        setMessages(messagesRes.data);
      } catch (error) {
        console.error('Failed to retrieve past messages:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchMessages();

    return () => {
      cancelled = true;
      if (ws.readyState === WebSocket.OPEN) ws.close();
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (input.trim() && socket.client?.readyState === WebSocket.OPEN) {
      socket.client.send(JSON.stringify({ message: input }));
      setInput('');
    }
  };

  return (
    <Layout heading="Chat">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 max-w-2xl" style={{ height: 'calc(100vh - 140px)' }}>
          {/* Message list */}
          <div
            className="flex-1 overflow-auto rounded-xl p-4 flex flex-col gap-2"
            style={{ background: 'var(--pv-chat-area-bg)', border: '1px solid var(--pv-card-border)' }}
          >
            {loading && (
              <div className="flex justify-center py-8">
                <div className="w-6 h-6 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(124,58,237,0.2)', borderTopColor: '#7c3aed' }} />
              </div>
            )}
            {messages.map((msg, idx) => {
              const isMe = msg.sender.username === myUsername;
              return (
                <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={isMe ? 'msg-bubble-self' : 'msg-bubble-other'}>
                    <div className="msg-sender">{msg.sender.username}</div>
                    <div className="text-sm break-words">{msg.content}</div>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          {/* Input row */}
          <div className="flex flex-col gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder="Type a message…  (Enter to send, Shift+Enter for new line)"
              className="pv-textarea"
              style={{ minHeight: '60px', maxHeight: '180px' }}
            />
            <button onClick={sendMessage} className="pv-btn self-start">
              <Send size={15} /> Send
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Chat;
