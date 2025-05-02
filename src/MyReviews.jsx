import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { FaStar } from 'react-icons/fa';

const MyReviews = () => {
  const auth = getAuth();
  const [user, setUser] = useState(null);
  const [myReviews, setMyReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ text: '', rating: 0 });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        fetchMyReviews(firebaseUser.uid);
      } else {
        setMyReviews([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchMyReviews = async (uid) => {
    try {
      const q = query(collection(db, 'reviews'), where('userId', '==', uid));
      const querySnapshot = await getDocs(q);
      const results = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMyReviews(results);
    } catch (err) {
      console.error('Error fetching your reviews:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (review) => {
    setEditingId(review.id);
    setEditData({ text: review.text, rating: review.rating });
  };

  const handleEditSubmit = async () => {
    try {
      await updateDoc(doc(db, 'reviews', editingId), {
        text: editData.text,
        rating: editData.rating,
      });
      alert('Review updated!');
      setEditingId(null);
      fetchMyReviews(user.uid);
    } catch (err) {
      alert('Failed to update review.');
      console.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this review?')) {
      try {
        await deleteDoc(doc(db, 'reviews', id));
        alert('Review deleted!');
        fetchMyReviews(user.uid);
      } catch (err) {
        alert('Failed to delete review.');
        console.error(err.message);
      }
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>My Reviews</h2>

      {loading ? (
        <p>Loading reviews...</p>
      ) : !user ? (
        <p>Please sign in to view your reviews.</p>
      ) : myReviews.length === 0 ? (
        <p>You haven’t written any reviews yet.</p>
      ) : (
        myReviews.map((rev) => (
          <div key={rev.id} style={styles.card}>
            {editingId === rev.id ? (
              <>
                <textarea
                  value={editData.text}
                  onChange={(e) => setEditData({ ...editData, text: e.target.value })}
                  style={styles.textarea}
                />
                <div style={styles.starRow}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      size={24}
                      color={editData.rating >= star ? '#ffc107' : '#ddd'}
                      onClick={() => setEditData({ ...editData, rating: star })}
                      style={{ cursor: 'pointer' }}
                    />
                  ))}
                </div>
                <button onClick={handleEditSubmit} style={styles.saveBtn}>
                  Save
                </button>
                <button onClick={() => setEditingId(null)} style={styles.cancelBtn}>
                  Cancel
                </button>
              </>
            ) : (
              <>
                <div style={styles.starRow}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      size={20}
                      color={rev.rating >= star ? '#ffc107' : '#ddd'}
                    />
                  ))}
                </div>
                <p style={{ color: '#111827' }}>{rev.text}</p> {/* ✅ TEXT COLOR FIXED */}
                <div style={styles.actionRow}>
                  <button onClick={() => handleEditClick(rev)} style={styles.editBtn}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(rev.id)} style={styles.deleteBtn}>
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: 600,
    margin: '0 auto',
    padding: 20,
    fontFamily: 'Arial, sans-serif',
  },
  heading: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#333',
  },
  card: {
    background: '#f9f9f9',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  },
  textarea: {
    width: '100%',
    height: 60,
    padding: 8,
    fontSize: 14,
    borderRadius: 6,
    border: '1px solid #ccc',
  },
  starRow: {
    display: 'flex',
    gap: 4,
    marginBottom: 8,
  },
  actionRow: {
    marginTop: 10,
    display: 'flex',
    gap: 10,
  },
  saveBtn: {
    backgroundColor: '#4caf50',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: 5,
    cursor: 'pointer',
  },
  cancelBtn: {
    backgroundColor: '#aaa',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: 5,
    cursor: 'pointer',
  },
  editBtn: {
    backgroundColor: '#2196f3',
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    borderRadius: 5,
    cursor: 'pointer',
  },
  deleteBtn: {
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    borderRadius: 5,
    cursor: 'pointer',
  },
};

export default MyReviews;