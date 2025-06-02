import React, { useState, useEffect, useRef } from 'react';
import { Send, Plus, Menu, X, Trash2 } from 'lucide-react';
import Sidebar from './Sidebar';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import LoadingDots from './LoadingDots';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [showSidebar, setShowSidebar] = useState(window.innerWidth >= 768);
  const messagesEndRef = useRef(null);

  const CONVERSATION_STARTER = "Create me a three-tier offer that I can sell to organizations based on my expertise?";

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setShowSidebar(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    loadChats();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadChats = async () => {
    try {
      const response = await fetch('https://ezoptionsai.com/api3/chats');
      const data = await response.json();
      if (data.success) {
        setChats(data.chats);
      }
    } catch (error) {
      console.error('Error loading chats:', error);
    }
  };

  const deleteChat = async (chatId, e) => {
    e.stopPropagation(); // Prevent chat selection when clicking delete button
    try {
      const response = await fetch(`https://ezoptionsai.com/api3/chat/${chatId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        if (currentChatId === chatId) {
          setMessages([]);
          setCurrentChatId(null);
        }
        await loadChats();
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };

  const loadChat = async (chatId) => {
    try {
      const response = await fetch(`https://ezoptionsai.com/api3/chat/${chatId}`);
      const data = await response.json();
      if (data.success) {
        setMessages(data.chat.messages);
        setCurrentChatId(chatId);
        if (window.innerWidth < 768) {
          setShowSidebar(false);
        }
      }
    } catch (error) {
      console.error('Error loading chat:', error);
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setCurrentChatId(null);
    if (window.innerWidth < 768) {
      setShowSidebar(false);
    }
  };

  const sendMessage = async (message) => {
    setIsLoading(true);
    const newMessages = [...messages, { role: "user", content: message }];
    setMessages(newMessages);
    setInputMessage('');

    try {
      const response = await fetch('https://ezoptionsai.com/api3/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: message,
          chat_history: newMessages,
          chat_id: currentChatId
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setMessages([
          ...newMessages,
          { role: "assistant", content: data.recommendation }
        ]);
        if (!currentChatId) {
          setCurrentChatId(data.chat_id);
          await loadChats();
        }
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages([
        ...newMessages,
        { role: "assistant", content: "Sorry, there was an error processing your request." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      sendMessage(inputMessage);
    }
  };

  return (
    <div className="h-screen flex">
      <Sidebar 
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
        chats={chats}
        currentChatId={currentChatId}
        loadChat={loadChat}
        startNewChat={startNewChat}
        deleteChat={deleteChat}
      />

      <div className="flex-1 flex flex-col relative">
        <div className="flex-1 flex flex-col bg-white rounded-lg shadow-lg m-4">
          <div className="p-6 border-b border-gray-200 relative">
            {/* Move toggle button to the right */}
            <button 
              onClick={() => setShowSidebar(!showSidebar)}
              className="absolute top-4 right-4 md:hidden z-30 p-2 bg-gray-100 rounded-lg"
            >
              {showSidebar ? <X size={24} /> : <Menu size={24} />}
            </button>

            <h1 className="text-2xl font-bold text-center text-gray-900 mt-8 md:mt-0">
              Finance GPT
            </h1>
            <p className="text-center text-gray-500 mt-2">
              This helps in financial literacy and guidance.
            </p>
            {/* {messages.length === 0 && (
              <button 
                onClick={() => sendMessage(CONVERSATION_STARTER)}
                className="text-black w-56 mx-auto mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-[#F5F7F8] rounded-lg hover:bg-[#e5e6e7] transition-colors duration-200"
              >
                Create me a three-tier offer that I can sell to organizations based on my expertise
              </button>
            )} */}
          </div>
          
          <MessageList 
            messages={messages} 
            isLoading={isLoading} 
            messagesEndRef={messagesEndRef}
          />

          <ChatInput 
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;