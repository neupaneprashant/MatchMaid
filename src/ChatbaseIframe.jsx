import React from 'react';
import { useNavigate } from 'react-router-dom';

const ChatbaseIframe = () => {
  const navigate = useNavigate();

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100vw', 
      height: '100vh', 
      zIndex: 1000,
      backgroundColor: '#fff' // optional if iframe is not 100% white
    }}>
      {/* Back Button */}
      <button
        onClick={() => navigate('/')} // Change to your target route
        style={{
          position: 'fixed',
          top: '20px',
          left: '20px',
          zIndex: 1100,
          background: '#4F46E5',
          color: 'white',
          border: 'none',
          padding: '10px 16px',
          borderRadius: '8px',
          fontSize: '16px',
          cursor: 'pointer',
          boxShadow: '0 2px 10px rgba(0,0,0,0.15)'
        }}
      >
        ⬅ Back to App
      </button>

      {/* Fullscreen Iframe */}
      <iframe
        src="https://www.chatbase.co/chatbot-iframe/6f-GZ4bhryII5F6ja4dk4"
        title="MatchMaid Chatbot"
        width="100%"
        height="100%"
        style={{ border: 'none' }}
        frameBorder="0"
        allow="clipboard-write"
      />
    </div>
  );
};

export default ChatbaseIframe;
