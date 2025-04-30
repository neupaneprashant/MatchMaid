// LoadingOverlay.jsx
import React from 'react';

const LoadingOverlay = () => (
  <div style={styles.overlay}>
    <div style={styles.spinner}></div>
  </div>
);

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10000,
  },
  spinner: {
    width: 48,
    height: 48,
    border: '6px solid #ccc',
    borderTop: '6px solid #04AA6D',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
};

// Add spin animation globally
const styleTag = document.createElement('style');
styleTag.innerHTML = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleTag);

export default LoadingOverlay;
