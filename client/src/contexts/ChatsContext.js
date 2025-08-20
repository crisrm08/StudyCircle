import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from './UserContext';

export const ChatsContext = createContext({
  chats: [],
  refreshChats: () => {},
});

export function ChatsProvider({ children }) {
  const { user } = useUser();
  const [chats, setChats] = useState([]);

  const fetchChats = async () => {
    if (!user) {
      setChats([]);
      return;
    }
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/chats`,
        { params: { user_id: user.user_id } }
      );
      setChats(Array.isArray(response.data.chats) ? response.data.chats : []);
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

  useEffect(() => {
    fetchChats();
  }, [user]);

  return (
    <ChatsContext.Provider value={{ chats, refreshChats: fetchChats }}>
      {children}
    </ChatsContext.Provider>
  );
}
