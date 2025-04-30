// Spinner.jsx
import React from 'react';

const Spinner = () => (
  <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
    <div className="spinner" />
    <style>
      {`
        .spinner {
          width: 36px;
          height: 36px;
          border: 4px solid #ccc;
          border-top: 4px solid #04AA6D;
          border-radius: 50%;
          animation: spin 0.9s linear infinite;
        }
        @keyframes spin {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}
    </style>
  </div>
);

export default Spinner;