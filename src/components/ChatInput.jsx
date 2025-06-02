import React from 'react';
import { Send } from 'lucide-react';

const ChatInput = ({ inputMessage, setInputMessage, handleSubmit, isLoading }) => {
  return (
    <form 
      onSubmit={handleSubmit}
      className="p-4 border-t border-gray-200"
    >
      <div className="flex gap-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-2 border border-gray-300 rounded-lg 
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button 
          type="submit" 
          disabled={isLoading || !inputMessage.trim()}
          className="flex items-center gap-2 px-4 py-2 bg-[#1A2130] 
                   text-white rounded-lg hover:bg-[#171d2b] 
                   transition-colors duration-200 disabled:bg-gray-300 
                   disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
          Send
        </button>
      </div>
    </form>
  );
};

export default ChatInput;