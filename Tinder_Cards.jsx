import React, { useState, useEffect } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import ProfilePanel from "./ProfilePanel";
import { FaUserCircle } from "react-icons/fa";
import "./Tinder_Cards.css";
import PayPalButton from "./Pay_Pal";
import { db } from "./firebase";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  setDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { addToFavorites } from "./favorites";

function getDistanceInMiles(lat1, lon1, lat2, lon2) {
  const R = 3958.8;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const createChatWithMaid = async (maidId) => {
  const auth = getAuth();
  const currentUser = auth.currentUser;
  if (!currentUser) return;

  try {
    const q = query(
      collection(db, "chats"),
      where("users", "array-contains", currentUser.uid)
    );
    const snapshot = await getDocs(q);

    for (let docSnap of snapshot.docs) {
      const data = docSnap.data();
      if (data.users.includes(maidId)) return;
    }

    const newChatRef = doc(collection(db, "chats"));
    await setDoc(newChatRef, {
      users: [currentUser.uid, maidId],
      createdAt: serverTimestamp(),
    });
    console.log("✅ New chat created between:", currentUser.uid, "and", maidId);
  } catch (err) {
    console.error("❌ Failed to create chat:", err);
  }
};

function Card({
  id,
  photo,
  name,
  pay,
  range,
  specs,
  languages,
  location,
  userLocation,
  setCards,
  cards,
  onMatch,
}) {
  const x = useMotionValue(0);
  const rotateBase = useTransform(x, [-150, 150], [-18, 18]);
  const opacity = useTransform(x, [-150, 0, 150], [0, 1, 0]);

  const isFront = id === cards[cards.length - 1]?.id;
  const offset = isFront ? 0 : id % 2 ? 6 : -6;
  const rotate = useTransform(rotateBase, (r) => `${r + offset}deg`);

  const handleDragEnd = () => {
    const swipeDistance = x.get();

    if (swipeDistance > 100) onMatch?.(id);

    if (Math.abs(swipeDistance) > 100) {
      const next = cards.filter((card) => card.id !== id);
      setCards(next);
    }
  };

  const distance =
    userLocation && location
      ? getDistanceInMiles(
          userLocation.lat,
          userLocation.lng,
          location.lat,
          location.lng
        ).toFixed(1)
      : null;

  return (
    <motion.div
      className="card"
      style={{
        x,
        rotate,
        opacity,
        scale: isFront ? 0.9 : 0.85,
        boxShadow: isFront
          ? "0 20px 25px -5px rgb(0 0 0 / 0.5), 0 8px 10px -6px rgb(0 0 0 / 0.5)"
          : undefined,
      }}
      animate={{ scale: isFront ? 0.9 : 0.85 }}
      drag={isFront ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
    >
      <img
        src={photo}
        alt="maid"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: "20px",
        }}
      />
      <div
        className="cardtext"
        style={{
          background: "rgba(0, 0, 0, 0.45)",
          color: "white",
          padding: "20px",
          backdropFilter: "blur(4px)",
          width: "100%",
          boxSizing: "border-box",
          position: "absolute",
          bottom: 0,
          left: 0,
        }}
      >
        <h3>{name}</h3>
        <p>${pay}/hr — {range} mi range</p>
        <p>{languages}</p>
        {distance && <p>📍 {distance} mi from you</p>}
      </div>
    </motion.div>
  );
}

function TinderCards() {
  const [cards, setCards] = useState([]);
  const [topCardId, setTopCardId] = useState(null);
  const [swipedCards, setSwipedCards] = useState([]);
  const [favoritedMaids, setFavoritedMaids] = useState([]);
  const [profileOpen, setProfileOpen] = useState(false);
  const [filters, setFilters] = useState({
    range: 50,
    pay: 0,
    specs: {},
    languages: "",
    location: null,
  });

  useEffect(() => {
    const fetchMaids = async () => {
      try {
        const profileSnapshot = await getDocs(collection(db, "profiles"));
        const maidProfiles = [];

        for (const docSnap of profileSnapshot.docs) {
          const profileData = docSnap.data();
          const uid = docSnap.id;

          const userDoc = await getDoc(doc(db, "users", uid));
          const userData = userDoc.exists() ? userDoc.data() : null;

          const isMaid = userData?.role === "maid";
          const hasPhotos = Array.isArray(profileData.photos) && profileData.photos.length > 0;

          if (isMaid && hasPhotos) {
            maidProfiles.push({
              id: uid,
              name: profileData.name || userData.name || "Unnamed",
              photo: profileData.photos[0],
              pay: profileData.pay || 0,
              range: profileData.range || 0,
              specs: profileData.specs || {},
              languages: profileData.languages || "",
              location: profileData.location || null,
            });
          }
        }

        setCards(maidProfiles);
      } catch (err) {
        console.error("Error fetching maids:", err);
      }
    };

    fetchMaids();
  }, []);

  useEffect(() => {
    if (cards.length > 0) {
      setTopCardId(cards[cards.length - 1].id);
    }
  }, [cards]);

  const handleFavorite = async (maidId) => {
    const user = getAuth().currentUser;
    if (!user || !maidId) return;

    try {
      await addToFavorites(user.uid, maidId);
      setFavoritedMaids((prev) => [...new Set([...prev, maidId])]);
    } catch (err) {
      console.error("Favorite failed:", err);
    }
  };

  const handleLike = async () => {
    if (!topCardId) return;
    await createChatWithMaid(topCardId);
    const next = cards.filter((c) => c.id !== topCardId);
    setCards(next);
    setTopCardId(next[next.length - 1]?.id || null);
  };

  const handleDislike = () => {
    if (!topCardId) return;
    const swiped = cards.find((c) => c.id === topCardId);
    const next = cards.filter((c) => c.id !== topCardId);
    setSwipedCards((prev) => [...prev, swiped]);
    setCards(next);
    setTopCardId(next[next.length - 1]?.id || null);
  };

  const handleRewind = () => {
    if (swipedCards.length === 0) return;
    const last = swipedCards[swipedCards.length - 1];
    const remaining = swipedCards.slice(0, -1);
    setCards((prev) => [...prev, last]);
    setSwipedCards(remaining);
    setTopCardId(last.id);
  };

  const filteredCards = cards.filter((maid) => {
    const specMatch = Object.entries(filters.specs).every(
      ([key, val]) => (val ? maid.specs?.[key] : true)
    );

    const langMatch =
      !filters.languages ||
      maid.languages?.toLowerCase().includes(filters.languages.toLowerCase());

    const payMatch = maid.pay >= filters.pay;

    const distanceMatch =
      filters.location && maid.location
        ? getDistanceInMiles(
            filters.location.lat,
            filters.location.lng,
            maid.location.lat,
            maid.location.lng
          ) <= filters.range
        : true;

    return specMatch && langMatch && payMatch && distanceMatch;
  });

  return (
    <>
      <div className="top-right-button">
        <PayPalButton />
      </div>

      <FaUserCircle
        onClick={() => setProfileOpen(!profileOpen)}
        size={32}
        style={{
          cursor: "pointer",
          position: "fixed",
          top: "1rem",
          left: "1rem",
          zIndex: 1100,
          color: profileOpen ? "#04AA6D" : "#ccc",
        }}
        title={profileOpen ? "Close Filters" : "Open Filters"}
      />

      <ProfilePanel
        open={profileOpen}
        setOpen={setProfileOpen}
        onFilterChange={setFilters}
      />

      <div className={`main-content ${profileOpen ? "shifted" : ""}`}>
        <div className="tinderCards__cardContainer">
          {filteredCards.length > 0 ? (
            filteredCards.map((card) => (
              <Card
                key={card.id}
                {...card}
                setCards={setCards}
                cards={filteredCards}
                userLocation={filters.location}
                onMatch={createChatWithMaid}
              />
            ))
          ) : (
            <div style={{ textAlign: "center", color: "#666", marginTop: "2rem" }}>
              <p>No maids match your filters.</p>
            </div>
          )}
        </div>
      </div>

      <div className="actionBar">
        <button onClick={handleRewind}>⟲</button>
        <button onClick={handleDislike}>❌</button>
        <button onClick={() => handleFavorite(topCardId)}>⭐</button>
        <button onClick={handleLike}>❤️</button>
      </div>
    </>
  );
}

export default TinderCards;