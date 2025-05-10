import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from './firebase';
import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where,
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

function HiredMaids() {
  const [currentUser, setCurrentUser] = useState(null);
  const [hiredMaids, setHiredMaids] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        await fetchHiredMaids(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchHiredMaids = async (userId) => {
    const bookingsSnap = await getDocs(
      query(collection(db, 'bookings'), where('userId', '==', userId))
    );

    const maids = await Promise.all(
      bookingsSnap.docs.map(async (bookingDoc) => {
        const booking = bookingDoc.data();
        const maidSnap = await getDoc(doc(db, 'users', booking.maidId));
        const maidData = maidSnap.exists() ? maidSnap.data() : {};
        return {
          id: bookingDoc.id,
          maidId: booking.maidId,
          name: maidData.name || 'Unknown Maid',
          avatar: maidData.photoURL || 'https://i.pravatar.cc/150?img=11',
          datetime: booking.datetime,
          status: booking.status,
        };
      })
    );

    setHiredMaids(maids);
  };

  if (!currentUser) return <div>Loading user...</div>;

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1 style={{ marginBottom: '1rem', color: '#e2e8f0' }}>🧹 Your Hired Maids</h1>
      <button
        onClick={() => navigate('/maid-chat')}
        style={{
          marginBottom: '2rem',
          backgroundColor: '#2563eb',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: 8,
          fontWeight: 'bold',
          cursor: 'pointer',
        }}
      >
        💬 Go to Chat
      </button>

      {hiredMaids.length === 0 ? (
        <p style={{ color: '#e5e7eb' }}>You haven't hired any maids yet.</p>
      ) : (
        hiredMaids.map((maid) => (
          <div
            key={maid.id}
            style={{
              backgroundColor: '#f9fafb',
              padding: '1rem',
              marginBottom: '1rem',
              borderRadius: '10px',
              width: '100%',
              maxWidth: '500px',
              marginInline: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
            }}
          >
            <img
              src={maid.avatar}
              alt={maid.name}
              style={{ width: 60, height: 60, borderRadius: '50%' }}
            />
            <div style={{ textAlign: 'left', color: '#111827' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{maid.name}</h3>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>
                <strong>Status:</strong> {maid.status}
              </p>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>
                <strong>Scheduled:</strong>{' '}
                {new Date(maid.datetime).toLocaleString()}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default HiredMaids;
