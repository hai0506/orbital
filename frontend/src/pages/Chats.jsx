import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import Chat from '@/components/Chat';
import api from '@/api';
import ChatData from '../data/Fundraisers';

const Chats = () => {
  const [hovered, setHovered] = useState(false);
  const [chats, setChats] = useState(null);
  const [loading, setLoading] = useState(false);

  // /*
  useEffect(() => {
    async function fetchChats() {
      try {
        const chatsRes = await api.get('core/chats/');
        console.log(chatsRes.data);
        setChats(chatsRes.data);
        chats?.map(chat => console.log(chat));
      } catch (error) {
        console.error('Failed to load chats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchChats();
  }, []);
  // */

  return (
    <Layout heading="Chats">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 grid grid-cols-3 gap-4">
            {chats?.map(chat => (
                  <Chat chat={chat} />
            ))}
        </div>
    </Layout>
  )
}

export default Chats