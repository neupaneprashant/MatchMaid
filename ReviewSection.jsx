import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { useLocation } from "react-router-dom";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { FaStar } from "react-icons/fa";

const ReviewSection = () => {
  const location = useLocation();
  const maidId = location.state?.maidId || "maid123";
  const userId = "user456"; // TODO: replace with auth.currentUser.uid
  const userName = "Test User"; // TODO: replace with auth.currentUser.displayName

  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 0, text: "" });
  const [hover, setHover] = useState(null);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const q = query(collection(db, "reviews"), where("maidId", "==", maidId));
      const querySnapshot = await getDocs(q);
      const fetched = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReviews(fetched);
    } catch (error) {
      console.error("Failed to fetch reviews:", error.message);
    }
  };

  const handleSubmit = async () => {
    if (!userId) {
      alert("You must be logged in to submit a review.");
      return;
    }

    try {
      await addDoc(collection(db, "reviews"), {
        userId,
        name: userName,
        rating: newReview.rating,
        text: newReview.text,
        maidId,
        timestamp: serverTimestamp(),
      });

      alert("Review submitted!");
      setNewReview({ rating: 0, text: "" });
      setEditingId(null);
      fetchReviews();
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review.");
    }
  };

  const handleEdit = (review) => {
    setNewReview({ rating: review.rating, text: review.text });
    setEditingId(review.id);
  };

  const handleReport = async (reviewId) => {
    const reason = prompt("Why are you reporting this review?");
    if (!reason) return;

    try {
      await addDoc(collection(db, "reports"), {
        reviewId,
        maidId,
        reportedBy: userId,
        reason,
        timestamp: new Date().toISOString(),
      });
      alert("Report submitted. Thank you.");
    } catch (error) {
      console.error("Report failed:", error.message);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Rate Your Experience </h2>
      {reviews.map((rev) => (
        <div key={rev.id} style={styles.reviewCard}>
          <div style={styles.starRow}>
            {[...Array(5)].map((_, index) => (
              <FaStar
                key={index}
                size={20}
                color={index < rev.rating ? "#ff6363" : "#ddd"}
              />
            ))}
          </div>
          <p>{rev.text}</p>
          <div style={styles.actionRow}>
            {rev.userId === userId && (
              <button style={styles.edit} onClick={() => handleEdit(rev)}>
                Edit
              </button>
            )}
            <button style={styles.report} onClick={() => handleReport(rev.id)}>
              Report
            </button>
          </div>
        </div>
      ))}

      <div style={styles.formCard}>
      <h3 style={{ marginBottom: 8, color: editingId ? "#000" : "#42f5e9" }}>
        {editingId ? "Edit Your Review" : "Add a Review"}
      </h3>

        <div style={styles.starRow}>
          {[...Array(5)].map((_, i) => {
            const ratingValue = i + 1;
            return (
              <label key={i}>
                <input
                  type="radio"
                  style={{ display: "none" }}
                  value={ratingValue}
                  onClick={() =>
                    setNewReview({ ...newReview, rating: ratingValue })
                  }
                />
                <FaStar
                  size={28}
                  color={
                    ratingValue <= (hover || newReview.rating)
                      ? "#ff6363"
                      : "#ddd"
                  }
                  onMouseEnter={() => setHover(ratingValue)}
                  onMouseLeave={() => setHover(null)}
                  style={{ cursor: "pointer", transition: "0.2s" }}
                />
              </label>
            );
          })}
        </div>
        <textarea
          placeholder="Say something about your experience..."
          style={styles.textarea}
          value={newReview.text}
          onChange={(e) =>
            setNewReview({ ...newReview, text: e.target.value })
          }
        />
        <button style={styles.submitBtn} onClick={handleSubmit}>
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
    fontFamily: "'Helvetica Neue', sans-serif",
    backgroundColor: "#f9fbfd",
    minHeight: "100vh",
    position: "relative",
    zIndex: 20, // ensure it's above other content
  },
  heading: {
    fontSize: "2rem",
    fontWeight: "bold",
    textAlign: "center",
    color: "#002B5B",
    marginBottom: 24,
  },
  reviewCard: {
    background: "black",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
    borderLeft: "4px solid #007bff",
  },
  formCard: {
    background: "#eaf6ff",
    padding: 20,
    borderRadius: 12,
    boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
    marginTop: 30,
  },
  textarea: {
    width: "100%",
    minHeight: 60,
    padding: 8,
    borderRadius: 6,
    border: "1px solid #ccc",
    marginTop: 10,
  },
  starRow: {
    display: "flex",
    gap: 6,
    marginBottom: 10,
  },
  submitBtn: {
    background: "#007bff",
    color: "#fff",
    padding: "10px 16px",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    marginTop: 10,
    fontWeight: "bold",
  },
  edit: {
    color: "#007bff",
    cursor: "pointer",
  },
  report: {
    color: "#e63946",
    cursor: "pointer",
    marginLeft: 10,
  },
  actionRow: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: 6,
  },
};

export default ReviewSection;
