import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import Chat from '@/components/Chat';
import api from '@/api';
import { Input } from "@/components/ui/input"

const Chats = () => {
  const [chats, setChats] = useState(null);
  const [fullChats, setFullChats] = useState(null);
  const [searchUsername, setSearchUsername] = useState("");

  useEffect(() => {
    async function fetchChats() {
      try {
        const chatsRes = await api.get('core/chats/');
        setChats(chatsRes.data);
        setFullChats(chatsRes.data);
      } catch (error) {
        console.error('Failed to load chats:', error);
      }
    }
    fetchChats();
  }, []);

  useEffect(() => {
    const filtered = fullChats?.filter(item =>
      item.other.username.toLowerCase().includes(searchUsername.toLowerCase())
    );
    setChats(filtered);
  }, [searchUsername, fullChats]);

  return (
    <Layout heading="Chats">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <Input
          type="search"
          placeholder="Search by username"
          onChange={e => setSearchUsername(e.target.value)}
          className="w-full md:w-1/3 mb-6"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {chats?.map(chat => (
            <Chat key={chat.other.id} chat={chat} />
          ))}
          {chats?.length === 0 && (
            <p className="pv-muted text-sm">No chats found.</p>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Chats;
