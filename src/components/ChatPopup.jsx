import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';

const ChatPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatId, setChatId] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsLoading(true);
    const currentMessage = message;
    setMessage('');

    try {
      const response = await fetch('https://ezoptionsai.com/api3/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: currentMessage,
          chat_history: chatHistory,
          chat_id: chatId
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setChatHistory(prev => [
          ...prev,
          { role: 'user', content: currentMessage },
          { role: 'assistant', content: data.recommendation }
        ]);
        setChatId(data.chat_id);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all ${isOpen ? 'hidden' : ''}`}
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chat popup */}
      {isOpen && (
        <div className="bg-white rounded-lg shadow-xl w-96 h-[600px] flex flex-col">
          {/* Header */}
          <div className="p-4 bg-blue-600 text-white rounded-t-lg flex justify-between items-center">
            <h3 className="font-semibold">Financial Assistant</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-blue-700 p-1 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatHistory.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-gray-100 text-gray-800 rounded-bl-none'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input form */}
          <form onSubmit={handleSubmit} className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask about stocks, investments..."
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatPopup;