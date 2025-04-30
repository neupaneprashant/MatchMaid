import React, { useState } from 'react';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { getAuth } from 'firebase/auth';
import ReviewPromptModal from './ReviewPromptModal';

const Bookings = () => {
  const auth = getAuth();
  const user = auth.currentUser;

  const [showModal, setShowModal] = useState(false);
  const [completedMaid, setCompletedMaid] = useState(null);

  const exampleMaid = {
    uid: 'maid123',
    name: 'Prasiddha Maid'
  };

  const handleCompleteBooking = async () => {
    if (!user) {
      alert("Not logged in");
      return;
    }

    const key = `${user.uid}_${exampleMaid.uid}`;
    try {
      await setDoc(doc(db, 'completedTasks', key), {
        userId: user.uid,
        maidId: exampleMaid.uid,
        status: 'completed',
        timestamp: serverTimestamp()
      });

      setCompletedMaid(exampleMaid);
      setShowModal(true);

    } catch (err) {
      console.error("❌ Error completing booking:", err);
      alert("Something went wrong!");
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>My Bookings</h2>
      <div style={cardStyle}>
        <h3>{exampleMaid.name}</h3>
        <p>Booking ID: #001-A</p>
        <button onClick={handleCompleteBooking} style={btnStyle}>✅ Mark Completed</button>
      </div>

      <ReviewPromptModal open={showModal} maid={completedMaid} />
    </div>
  );
};

const cardStyle = {
  border: '1px solid #ccc',
  padding: 16,
  borderRadius: 8,
  marginTop: 12
};

const btnStyle = {
  backgroundColor: '#04AA6D',
  color: 'white',
  padding: '8px 16px',
  border: 'none',
  borderRadius: 5,
  marginTop: 10,
  cursor: 'pointer'
};

export default Bookings;