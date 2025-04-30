import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { useLocation } from "react-router-dom";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { FaStar } from "react-icons/fa";

const ReviewSection = () => {
  const location = useLocation();
  const auth = getAuth();
  const user = auth.currentUser;

  const maidId = location.state?.maidId;
  const maidName = location.state?.maidName || "this maid";
  const userId = user?.uid || "user456";
  const userName = user?.displayName || "Test User";

  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 0, text: "" });
  const [hover, setHover] = useState(null);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, [maidId]);

  const fetchReviews = async () => {
    try {
      const q = query(collection(db, "reviews"), where("maidId", "==", maidId));
      const querySnapshot = await getDocs(q);
      const fetched = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        replyDraft: doc.data().reply || "",
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

      alert("✅ Review submitted!");

      const maidProfileRef = doc(db, "profiles", maidId);
      const maidProfileSnap = await getDoc(maidProfileRef);

      if (maidProfileSnap.exists()) {
        const maidData = maidProfileSnap.data();
        const fcmToken = maidData.fcmToken;

        if (fcmToken) {
          await fetch("https://us-central1-maid-match-7e3c8.cloudfunctions.net/sendNotification", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              token: fcmToken,
              title: "New Review Received!",
              body: `${userName} left you a review!`,
              icon: "https://maid-match-7e3c8.web.app/maid-icon.png",
              badge: 1,
              vibrate: [100, 200, 300],
              click_action: "https://maid-match-7e3c8.web.app/tinder-shuffle/review",
            }),
          });

          console.log(" Notification sent to Maid!");
        } else {
          console.warn("⚠️ Maid does not have an FCM token.");
        }
      }

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
      <h2 style={styles.heading}>Leave a review for {maidName}</h2>

      {reviews.map((rev) => {
        const isMaid = rev.maidId === user?.uid;
        const isReviewer = rev.userId === userId;

        return (
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

            {rev.reply && (
              <div style={{ marginTop: "0.5rem", fontStyle: "italic", color: "#00bfa5" }}>
                <strong>Reply from Maid:</strong> {rev.reply}
              </div>
            )}

            {isMaid && (
              <div style={{ marginTop: "0.5rem" }}>
                <input
                  type="text"
                  placeholder="Reply to this review..."
                  value={rev.replyDraft}
                  onChange={(e) => {
                    const updated = reviews.map((r) =>
                      r.id === rev.id ? { ...r, replyDraft: e.target.value } : r
                    );
                    setReviews(updated);
                  }}
                  style={{ padding: "0.4rem", width: "80%" }}
                />
                <button
                  onClick={async () => {
                    const replyText = reviews.find((r) => r.id === rev.id).replyDraft;
                    await updateDoc(doc(db, "reviews", rev.id), { reply: replyText });
                    fetchReviews();
                    setTimeout(() => {
                      alert("✅ Reply saved successfully!");
                    }, 300);
                  }}
                  style={{
                    marginLeft: "0.5rem",
                    padding: "0.4rem 1rem",
                    backgroundColor: "#04AA6D",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                  }}
                >
                  Save
                </button>
              </div>
            )}

            {isReviewer && (
              <div style={styles.actionRow}>
                <button style={styles.edit} onClick={() => handleEdit(rev)}>
                  Edit
                </button>
                <button style={styles.report} onClick={() => handleReport(rev.id)}>
                  Report
                </button>
              </div>
            )}
          </div>
        );
      })}

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
    zIndex: 20,
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
    color: "white",
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

