import React from 'react';
import { useNavigate } from 'react-router-dom';

const ReviewPromptModal = ({ open, maid }) => {
  const navigate = useNavigate();

  if (!open || !maid) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3>Task Completed</h3>
        <p>Would you like to leave a review for <strong>{maid.name}</strong>?</p>
        <div style={styles.actions}>
          <button
            onClick={() => navigate('/review', {
              state: {
                maidId: maid.uid,
                maidName: maid.name
              }
            })}
            style={styles.confirm}
          >
            ✅ Yes, Leave a Review
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0,
    width: '100vw', height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.4)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999
  },
  modal: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 10,
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
    textAlign: 'center',
    width: '90%',
    maxWidth: 420,
  },
  actions: {
    marginTop: 20,
  },
  confirm: {
    backgroundColor: '#04AA6D',
    color: 'white',
    padding: '10px 16px',
    border: 'none',
    borderRadius: 6,
    fontSize: 16,
    cursor: 'pointer'
  }
};

export default ReviewPromptModal;
