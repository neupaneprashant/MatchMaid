import React, { useState, useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";
import { FaStar } from "react-icons/fa";
import Spinner from "./Spinner";

const MaidRatingAnalytics = ({ maidId }) => {
  const [ratings, setRatings] = useState([]);
  const [average, setAverage] = useState(0);
  const [counts, setCounts] = useState({ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!maidId || typeof maidId !== "string" || maidId.length < 10) {
      console.warn("Invalid maidId passed to MaidRatingAnalytics:", maidId);
      return;
    }

    setLoading(true);
    const q = query(collection(db, "reviews"), where("maidId", "==", maidId));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        console.warn("No reviews found for this maid:", maidId);
        setRatings([]);
        setAverage(0);
        setCounts({ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });
        setLoading(false);
        return;
      }

      const data = snapshot.docs.map((doc) => doc.data() || {});
      const total = data.length;
      const sum = data.reduce((acc, r) => acc + (r.rating || 0), 0);
      const avg = total > 0 ? (sum / total).toFixed(2) : 0;

      const countsObj = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      data.forEach((r) => {
        const rating = r.rating || 0;
        if (countsObj[rating] !== undefined) countsObj[rating]++;
      });

      setRatings(data);
      setAverage(avg);
      setCounts(countsObj);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [maidId]);

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Rating Analytics</h3>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <div style={styles.average}>
            <strong>Average Rating:</strong>{" "}
            <span style={{ fontSize: "1.4rem", color: "#ff9900" }}>{average}</span> / 5
          </div>

          <div style={styles.barContainer}>
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} style={styles.barRow}>
                <span><FaStar color="#ffb400" /> {star}★</span>
                <progress
                  max={ratings.length}
                  value={counts[star]}
                  style={styles.progress}
                />
                <span>{counts[star]}</span>
              </div>
            ))}
          </div>
          <p>Total Reviews: {ratings.length}</p>
        </>
      )}
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "#f9f9f9",
    padding: 20,
    borderRadius: 12,
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    marginTop: 24,
    maxWidth: 500,
    color: "#111827",
  },
  title: {
    fontSize: "1.4rem",
    marginBottom: 12,
    fontWeight: "bold",
  },
  average: {
    marginBottom: 20,
  },
  barContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    marginBottom: 12,
  },
  barRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  progress: {
    flex: 1,
    height: 12,
    borderRadius: 6,
  },
};

export default MaidRatingAnalytics;

