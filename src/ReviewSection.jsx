import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { useLocation } from "react-router-dom";
import { getAuth } from "firebase/auth";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { FaStar } from "react-icons/fa";

const ReviewSection = () => {
  const location = useLocation();
  const auth = getAuth();
  const user = auth.currentUser;

  const maidId = location.state?.maidId || "maid123";
  const userId = user?.uid || "user456";
  const userName = user?.displayName || "Test User";

  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 0, text: "" });
  const [hover, setHover] = useState(null);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    const q = query(collection(db, "reviews"), where("maidId", "==", maidId));
    const snap = await getDocs(q);
    const results = snap.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      replyDraft: doc.data().reply || ""
    }));
    setReviews(results);
  };

  const handleSubmit = async () => {
    if (!userId) return alert("Login required to submit a review.");
    if (!newReview.text || !newReview.rating) return alert("Complete all fields.");

    await addDoc(collection(db, "reviews"), {
      maidId,
      userId,
      name: userName,
      text: newReview.text,
      rating: newReview.rating,
      timestamp: serverTimestamp(),
    });
    setNewReview({ rating: 0, text: "" });
    fetchReviews();
  };

  const handleReplySave = async (reviewId, replyText) => {
    await updateDoc(doc(db, "reviews", reviewId), { reply: replyText });
    fetchReviews();
    alert("Reply saved!");
  };

  const handleEdit = (rev) => {
    setNewReview({ rating: rev.rating, text: rev.text });
    setEditingId(rev.id);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Leave a review for {maidId}</h2>

      {reviews.map((rev) => {
        const isReviewer = rev.userId === userId;
        const isMaid = rev.maidId === userId;

        return (
          <div key={rev.id} style={styles.reviewCard}>
            <div style={styles.starRow}>
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} size={20} color={i < rev.rating ? "#ffc107" : "#ccc"} />
              ))}
            </div>
            <p style={{ color: "#000" }}>{rev.text}</p>

            {rev.reply && (
              <p style={{ fontStyle: "italic", color: "#047857" }}>
                Maid replied: {rev.reply}
              </p>
            )}

            {isMaid && (
              <div>
                <input
                  value={rev.replyDraft}
                  onChange={(e) => {
                    const updated = reviews.map(r =>
                      r.id === rev.id ? { ...r, replyDraft: e.target.value } : r
                    );
                    setReviews(updated);
                  }}
                  placeholder="Reply..."
                  style={styles.textarea}
                />
                <button onClick={() => handleReplySave(rev.id, rev.replyDraft)} style={styles.submitBtn}>
                  Save Reply
                </button>
              </div>
            )}

            {isReviewer && (
              <div style={styles.actionRow}>
                <button style={styles.edit} onClick={() => handleEdit(rev)}>Edit</button>
              </div>
            )}
          </div>
        );
      })}

      <div style={styles.formCard}>
        <h3 style={{ color: "#222" }}>
          {editingId ? "Edit Your Review" : "Add a Review"}
        </h3>
        <div style={styles.starRow}>
          {[1, 2, 3, 4, 5].map((val) => (
            <label key={val}>
              <input type="radio" style={{ display: "none" }} value={val} />
              <FaStar
                size={26}
                color={val <= (hover || newReview.rating) ? "#ffc107" : "#ccc"}
                onMouseEnter={() => setHover(val)}
                onMouseLeave={() => setHover(null)}
                onClick={() => setNewReview({ ...newReview, rating: val })}
              />
            </label>
          ))}
        </div>
        <textarea
          placeholder="Write your review..."
          value={newReview.text}
          onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
          style={styles.textarea}
        />
        <button onClick={handleSubmit} style={styles.submitBtn}>
          {editingId ? "Update Review" : "Submit Review"}
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: 600,
    margin: "0 auto",
    padding: 20,
    fontFamily: "Arial",
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: "1.8rem",
    fontWeight: "bold",
    marginBottom: 24,
    color: "#333",
  },
  reviewCard: {
    background: "#f9f9f9",
    padding: 16,
    marginBottom: 16,
    borderRadius: 10,
    borderLeft: "4px solid #04AA6D",
  },
  starRow: {
    display: "flex",
    gap: 4,
    marginBottom: 6,
  },
  actionRow: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 6,
  },
  edit: {
    color: "#007bff",
    cursor: "pointer",
    background: "none",
    border: "none",
  },
  textarea: {
    width: "100%",
    padding: 8,
    borderRadius: 6,
    border: "1px solid #ccc",
    marginTop: 6,
  },
  submitBtn: {
    backgroundColor: "#04AA6D",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: 5,
    marginTop: 10,
  },
  formCard: {
    backgroundColor: "#eaf6ff",
    padding: 16,
    borderRadius: 10,
    marginTop: 24,
  },
};

export default ReviewSection;
