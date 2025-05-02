import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import {
  getAuth,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  onSnapshot
} from 'firebase/firestore';
import EarningsChart from './EarningsChart';
import MaidRatingAnalytics from './MaidRatingAnalytics';
import './maidportal.css';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

function MaidPortal() {
  const [transactions, setTransactions] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('dashboard');
  const [earningsData, setEarningsData] = useState([]);
  const [maidReviews, setMaidReviews] = useState([]);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [sortOption, setSortOption] = useState('newest');
  const [maid, setMaid] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    let unsubscribeReviews = () => {};
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setMaid(user);
        const q = query(collection(db, 'transactions'), where('maidId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const fetched = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTransactions(fetched);

        const earnings = fetched.reduce((sum, trans) => sum + parseFloat(trans.amount), 0);
        setTotalEarnings(earnings);

        const monthTotals = {};
        fetched.forEach((t) => {
          if (t.date) {
            const dateObj = t.date.toDate();
            const month = format(dateObj, 'MMM');
            monthTotals[month] = (monthTotals[month] || 0) + parseFloat(t.amount);
          }
        });

        const monthlyData = Object.entries(monthTotals).map(([month, amount]) => ({
          month,
          amount,
        }));
        setEarningsData(monthlyData);

        const reviewsQ = query(collection(db, 'reviews'), where('maidId', '==', user.uid));
        unsubscribeReviews = onSnapshot(reviewsQ, (snapshot) => {
          const reviews = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            editing: false,
            replyDraft: doc.data().reply || '',
          }));
          setMaidReviews(reviews);
        });
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
      unsubscribeReviews();
    };
  }, []);

  const handleSignOut = async () => {
    await signOut(getAuth());
    window.location.href = '/';
  };

  const handleSaveReply = async (id, replyText) => {
    await updateDoc(doc(db, 'reviews', id), { reply: replyText });
    const updated = maidReviews.map(r =>
      r.id === id ? { ...r, reply: replyText, editing: false, replyDraft: '' } : r
    );
    setMaidReviews(updated);
    alert('✅ Reply updated');
  };

  const sortReviews = (reviews, option) => {
    switch (option) {
      case 'newest':
        return [...reviews].sort((a, b) => b.timestamp?.seconds - a.timestamp?.seconds);
      case 'oldest':
        return [...reviews].sort((a, b) => a.timestamp?.seconds - b.timestamp?.seconds);
      case 'highest':
        return [...reviews].sort((a, b) => b.rating - a.rating);
      case 'lowest':
        return [...reviews].sort((a, b) => a.rating - b.rating);
      default:
        return reviews;
    }
  };

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div className="maid-portal-container">
      <div className="sidebar">
        <h2 className="dashboard-title">Maid Dashboard</h2>
        <div className="sidebar-options">
          <button onClick={() => setView('dashboard')}>🏠 Overview</button>
          <button onClick={() => navigate('/maid-chat')}>💬 Go to Chat</button>
          <button onClick={() => setView('chart')}>📈 Earnings Chart</button>
          <button onClick={() => setView('filter')}>✅ Filter Bookings</button>
          <button onClick={() => setView('calendar')}>📅 Manage Availability</button>
          <button onClick={() => setView('reviews')}>🗨️ View Reviews</button>
          <button onClick={() => navigate('/my-reviews')}>📝 My Reviews</button>
        </div>
        <button className="signout-button" onClick={handleSignOut}>🚪 Sign Out</button>
      </div>

      <div className="dashboard-content">
        {view === 'dashboard' && (
          <>
            <h1 className="welcome-text">Welcome!</h1>
            <h2 className="total-earnings">Total Earnings: ${totalEarnings.toFixed(2)}</h2>
            <div className="transactions-section">
              <h3>Past Bookings</h3>
              {transactions.length === 0 ? (
                <p>No bookings yet</p>
              ) : (
                <ul>
                  {transactions.map((t) => (
                    <li key={t.id}>
                      <strong>Amount:</strong> ${t.amount} — <strong>Status:</strong> {t.status}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}

        {view === 'chart' && <EarningsChart earningsData={earningsData} />}
        {view === 'filter' && <h2>Filter Bookings (coming soon)</h2>}
        {view === 'calendar' && (
          <div>
            <button onClick={() => navigate('/maid-schedule')}>🗓️ Create Schedule</button>
          </div>
        )}

        {view === 'reviews' && (
          <div style={{ marginTop: '2rem', color: '#111827' }}>
            <h2>Client Reviews</h2>
            {maidReviews.length > 0 && (
              <div style={{ marginBottom: 12 }}>
                <label><strong>Sort by:</strong></label>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  style={{ marginLeft: 8, padding: '0.4rem' }}
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="highest">Highest Rating</option>
                  <option value="lowest">Lowest Rating</option>
                </select>
              </div>
            )}

            {sortReviews(maidReviews, sortOption).map((review) => (
              <div key={review.id} style={{
                background: '#f1f5f9',
                padding: '1rem',
                marginBottom: '1rem',
                borderRadius: 8,
                borderLeft: '4px solid #04AA6D',
              }}>
                <p><strong>{review.name}</strong> said:</p>
                <p>{review.text}</p>

                {review.editing ? (
                  <>
                    <textarea
                      value={review.replyDraft || review.reply || ''}
                      onChange={(e) => {
                        const updated = maidReviews.map(r =>
                          r.id === review.id
                            ? { ...r, replyDraft: e.target.value }
                            : r
                        );
                        setMaidReviews(updated);
                      }}
                      style={{ width: '100%', padding: '0.5rem' }}
                    />
                    <div style={{ marginTop: '0.5rem' }}>
                      <button
                        onClick={() => handleSaveReply(review.id, review.replyDraft)}
                        style={{
                          backgroundColor: '#04AA6D',
                          color: 'white',
                          padding: '6px 12px',
                          border: 'none',
                          borderRadius: 5,
                          marginRight: 10,
                        }}
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          const updated = maidReviews.map(r =>
                            r.id === review.id
                              ? { ...r, editing: false, replyDraft: '' }
                              : r
                          );
                          setMaidReviews(updated);
                        }}
                        style={{
                          backgroundColor: '#aaa',
                          color: 'white',
                          padding: '6px 12px',
                          border: 'none',
                          borderRadius: 5,
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {review.reply && (
                      <p style={{ fontStyle: 'italic', color: '#047857' }}>
                        Reply: {review.reply}
                      </p>
                    )}
                    <button
                      onClick={() => {
                        const updated = maidReviews.map(r =>
                          r.id === review.id ? { ...r, editing: true } : r
                        );
                        setMaidReviews(updated);
                      }}
                      style={{
                        fontSize: 12,
                        color: '#007bff',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      ✏️ Edit Reply
                    </button>
                  </>
                )}
                <p style={{ fontSize: 12, color: '#333' }}>Rating: {review.rating}⭐</p>
              </div>
            ))}

            <button
              onClick={() => setShowAnalytics(!showAnalytics)}
              style={{
                backgroundColor: '#007bff',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: 6,
                marginTop: 20,
              }}
            >
              {showAnalytics ? 'Hide Analytics' : 'Show Rating Analytics'}
            </button>

            {showAnalytics && maid?.uid && (
              <MaidRatingAnalytics maidId={maid.uid} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MaidPortal;
