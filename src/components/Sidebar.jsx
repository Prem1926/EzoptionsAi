import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

const Sidebar = ({ 
  showSidebar, 
  setShowSidebar, 
  chats, 
  currentChatId, 
  loadChat, 
  startNewChat,
  deleteChat 
}) => {
  return (
    <div className={`${showSidebar ? 'translate-x-0' : '-translate-x-full'} 
                    fixed md:relative w-64 bg-gray-50 h-full transition-transform 
                    duration-300 ease-in-out z-20 border-r border-gray-200`}>
      <div className="p-4 flex flex-col h-full">
        <button 
          onClick={startNewChat}
          className="w-full mb-4 flex items-center justify-center gap-2 px-4 py-2 
                   bg-[#1A2130] text-white rounded-lg hover:bg-[#171d2b] 
                   transition-colors duration-200"
        >
          <Plus className="w-4 h-4" />
          New Chat
        </button>
        <div className="flex-1 overflow-y-auto">
          {chats.map((chat) => (
            <div
              key={chat._id}
              className={`group relative flex items-center w-full text-left p-2 rounded-lg mb-2 
                         hover:bg-gray-200 transition-colors duration-200
                         ${currentChatId === chat._id ? 'bg-gray-200' : ''}`}
            >
              <button
                onClick={() => loadChat(chat._id)}
                className="flex-1 truncate text-left"
              >
                {chat.title}
              </button>
              <button
                onClick={(e) => deleteChat(chat._id, e)}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-300 rounded transition-opacity duration-200"
                title="Delete chat"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;