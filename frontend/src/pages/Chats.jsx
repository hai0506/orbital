import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import Chat from '@/components/Chat';
import api from '@/api';
import ChatData from '../data/Fundraisers';
import { Input } from "@/components/ui/input"

const Chats = () => {
  const [hovered, setHovered] = useState(false);
  const [chats, setChats] = useState(null);
  const [fullChats, setFullChats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchUsername, setSearchUsername] = useState("");

  // /*
  useEffect(() => {
    async function fetchChats() {
      try {
        const chatsRes = await api.get('core/chats/');
        console.log(chatsRes.data);
        setChats(chatsRes.data);
        setFullChats(chatsRes.data);
        chats?.map(chat => console.log(chat));
      } catch (error) {
        console.error('Failed to load chats:', error);
      } finally {
        setLoading(false);
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
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-3">
        <Input
          type="search"
          placeholder="Search by Username"
          onChange={e => setSearchUsername(e.target.value)}
          className="w-full md:w-1/3 mb-4"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {chats?.map(chat => (
              <Chat chat={chat} />
            ))}
            {chats?.length == 0 && (
              <p>No chats found.</p>
            )}
        </div>
      </div>
    </Layout>
  );
}

export default Chats