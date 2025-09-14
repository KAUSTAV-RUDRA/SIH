// src/components/PageA.jsx
import React, { useState } from 'react';
import './Page.css';

export default function PageA() {
  const [prompt, setPrompt] = useState('');
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSend = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError('');
    setReply(''); // Clear previous response

    try {
      // Use backend proxy to avoid CORS issues
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: prompt })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to get response');
      }
      setReply(data.response);
    } catch (err) {
      console.error('Chatbot Error:', err);
      setError('Failed to connect to backend/Ollama. Make sure both are running.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSend();
    }
  };

  return (
    <div className="page-container">
      <h2>Local AI Chatbot</h2>
      <p className="subtitle">Powered by Ollama - Free & Private</p>
      
      <div className="chat-container">
        <textarea
          className="page-input"
          rows={4}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask me anything... (Ctrl+Enter to send)"
          disabled={loading}
        />
        
        <button
          className="page-button"
          onClick={handleSend}
          disabled={loading || !prompt.trim()}
        >
          {loading ? 'AI is thinking...' : 'Send Message'}
        </button>

        {error && (
          <div className="page-error">
            ❌ {error}
          </div>
        )}

        {reply && (
          <div className="page-reply">
            <h3>AI Response:</h3>
            <div className="response-text">{reply}</div>
          </div>
        )}
      </div>
    </div>
  );
}
