import React from 'react';
import ReactMarkdown from 'react-markdown';
import LoadingDots from './LoadingDots';

const MessageList = ({ messages, isLoading, messagesEndRef }) => {
  return (
    <div className="flex-1 overflow-auto p-4 space-y-4">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex ${
            message.role === 'user' ? 'justify-end' : 'justify-start'
          }`}
        >
          <div
            className={`max-w-[80%] rounded-lg p-3 ${
              message.role === 'user'
                ? 'bg-[#1A2130] text-white'
                : 'bg-gray-100 text-gray-900'
            }`}
          >
            {message.role === 'user' ? (
              <div className="whitespace-pre-wrap">{message.content}</div>
            ) : (
              <ReactMarkdown
                className="prose prose-sm max-w-none dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
                components={{
                  // Style code blocks
                  code({ node, inline, className, children, ...props }) {
                    return (
                      <code
                        className={`${inline ? 'bg-gray-200 rounded px-1' : 
                          'block bg-gray-800 text-white p-2 rounded-lg'}`}
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },
                  // Style links
                  a({ node, children, ...props }) {
                    return (
                      <a
                        className="text-blue-600 hover:text-blue-800"
                        {...props}
                      >
                        {children}
                      </a>
                    );
                  },
                  // Style lists
                  ul({ node, children, ...props }) {
                    return (
                      <ul className="list-disc pl-4 space-y-1" {...props}>
                        {children}
                      </ul>
                    );
                  },
                  ol({ node, children, ...props }) {
                    return (
                      <ol className="list-decimal pl-4 space-y-1" {...props}>
                        {children}
                      </ol>
                    );
                  }
                }}
              >
                {message.content}
              </ReactMarkdown>
            )}
          </div>
        </div>
      ))}
      {isLoading && (
        <div className="flex justify-start">
          <div className="max-w-[80%] rounded-lg p-3 bg-gray-100">
            <LoadingDots />
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;