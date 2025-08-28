import { useState, useEffect, useRef } from 'react';
import { useBroadcastEvent, useEventListener } from '../lib/liveblocks';


export default function LiveChat({ isOpen, onClose }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState({});
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const { user } = useAuth();

  const broadcast = useBroadcastEvent();

  // Listen for chat events
  useEventListener(({ event }) => {
    switch (event.type) {
      case 'chat-message':
        setMessages(prev => [...prev, {
          id: event.id,
          message: event.message,
          user: event.user,
          timestamp: event.timestamp,
        }]);
        break;
      
      case 'typing-start':
        setIsTyping(prev => ({
          ...prev,
          [event.userId]: event.user
        }));
        break;
      
      case 'typing-stop':
        setIsTyping(prev => {
          const updated = { ...prev };
          delete updated[event.userId];
          return updated;
        });
        break;
    }
  });

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle typing indicators
  useEffect(() => {
    let typingTimer;
    
    const handleTyping = () => {
      broadcast({
        type: 'typing-start',
        userId: user.uid,
        user: {
          name: user.displayName || user.email,
          avatar: user.photoURL,
        }
      });

      clearTimeout(typingTimer);
      typingTimer = setTimeout(() => {
        broadcast({
          type: 'typing-stop',
          userId: user.uid,
        });
      }, 1000);
    };

    if (newMessage.trim()) {
      handleTyping();
    }

    return () => {
      clearTimeout(typingTimer);
    };
  }, [newMessage, broadcast, user]);

  const sendMessage = (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;

    const messageData = {
      type: 'chat-message',
      id: `${Date.now()}-${user.uid}`,
      message: newMessage.trim(),
      user: {
        id: user.uid,
        name: user.displayName || user.email,
        avatar: user.photoURL,
      },
      timestamp: Date.now(),
    };

    broadcast(messageData);
    setNewMessage('');

    // Stop typing indicator
    broadcast({
      type: 'typing-stop',
      userId: user.uid,
    });
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 w-80 h-96 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">Chat</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 p-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 text-sm py-8">
            No messages yet. Start a conversation!
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble key={message.id} message={message} currentUser={user} />
          ))
        )}

        {/* Typing indicators */}
        {Object.values(isTyping).map((typingUser) => (
          <div key={typingUser.id} className="flex items-center gap-2 text-sm text-gray-500">
            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
              {typingUser.avatar ? (
                <img 
                  src={typingUser.avatar} 
                  alt={typingUser.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                typingUser.name?.charAt(0)?.toUpperCase()
              )}
            </div>
            <span>{typingUser.name} is typing...</span>
            <div className="flex gap-1">
              <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="p-3 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}

function MessageBubble({ message, currentUser }) {
  const isOwn = message.user.id === currentUser.uid;
  
  return (
    <div className={`flex gap-2 ${isOwn ? 'flex-row-reverse' : ''}`}>
      <div className="w-6 h-6 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center">
        {message.user.avatar ? (
          <img 
            src={message.user.avatar} 
            alt={message.user.name}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <span className="text-xs">
            {message.user.name?.charAt(0)?.toUpperCase()}
          </span>
        )}
      </div>
      
      <div className={`max-w-xs ${isOwn ? 'text-right' : ''}`}>
        <div className={`inline-block px-3 py-2 rounded-lg text-sm ${
          isOwn 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-100 text-gray-900'
        }`}>
          {message.message}
        </div>
        
        <div className={`text-xs text-gray-500 mt-1 ${isOwn ? 'text-right' : ''}`}>
          <span className="font-medium">{message.user.name}</span>
          <span className="mx-1">•</span>
          <time>{formatTime(message.timestamp)}</time>
        </div>
      </div>
    </div>
  );
}