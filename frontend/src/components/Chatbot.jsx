import React, { useState, useRef, useEffect } from 'react';
import './Chatbot.css';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      text: "Hello! I'm your local AI assistant powered by Ollama. How can I help you today?",
      sender: 'bot'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Backend API URL
  const API_BASE_URL = 'http://localhost:5000';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      text: inputMessage,
      sender: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      console.log('Sending message to backend API:', inputMessage);
      
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputMessage }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      if (!data.success) {
        throw new Error(data.error || 'API returned error');
      }
      
      console.log('Received response from backend:', data.response);
      
      const botMessage = {
        text: data.response,
        sender: 'bot'
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Detailed error:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      // Provide more specific error messages
      let errorText = "Sorry, I encountered an error. Please try again.";
      
      if (error.message.includes('API_KEY_INVALID')) {
        errorText = "API key is invalid. Please check the configuration.";
      } else if (error.message.includes('QUOTA_EXCEEDED')) {
        errorText = "API quota exceeded. Please try again later.";
      } else if (error.message.includes('CORS')) {
        errorText = "Network error. Please check your internet connection.";
      } else if (error.message.includes('fetch')) {
        errorText = "Network connection failed. Please try again.";
      }
      
      const errorMessage = {
        text: errorText,
        sender: 'bot'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        text: "Hello! I'm your local AI assistant powered by Ollama. How can I help you today?",
        sender: 'bot'
      }
    ]);
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h3>Ollama AI Chatbot</h3>
        <button onClick={clearChat} className="clear-btn">
          Clear Chat
        </button>
      </div>
      
      <div className="messages-container">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
          >
            <div className="message-content">
              {message.text}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="message bot-message">
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="input-container">
        <textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message here..."
          className="message-input"
          rows="1"
          disabled={isLoading}
        />
        <button
          onClick={sendMessage}
          disabled={!inputMessage.trim() || isLoading}
          className="send-btn"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
