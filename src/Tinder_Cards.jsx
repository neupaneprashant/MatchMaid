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
  updateDoc,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
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
  } catch (err) {
    console.error("❌ Failed to create chat:", err);
  }
};

const saveSwipeToFirestore = async (userId, maidId) => {
  const swipeRef = doc(db, "swipes", userId);
  const swipeDoc = await getDoc(swipeRef);

  if (swipeDoc.exists()) {
    await updateDoc(swipeRef, { swiped: arrayUnion(maidId) });
  } else {
    await setDoc(swipeRef, { swiped: [maidId] });
  }
};

const removeSwipeFromFirestore = async (userId, maidId) => {
  try {
    await updateDoc(doc(db, "swipes", userId), {
      swiped: arrayRemove(maidId),
    });
  } catch (err) {
    console.error("Error removing swipe:", err);
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
  bio,
  location,
  userLocation,
  setCards,
  cards,
  updateSwipedMaids,
}) {
  const x = useMotionValue(0);
  const rotateBase = useTransform(x, [-150, 150], [-18, 18]);
  const opacity = useTransform(x, [-150, 0, 150], [0, 1, 0]);

  const isFront = id === cards[cards.length - 1]?.id;
  const offset = isFront ? 0 : id % 2 ? 6 : -6;
  const rotate = useTransform(rotateBase, (r) => `${r + offset}deg`);

  const handleDragEnd = async () => {
    const swipeDistance = x.get();
    if (Math.abs(swipeDistance) > 100) {
      const next = cards.filter((card) => card.id !== id);
      setCards(next);
      await updateSwipedMaids(id);
      if (swipeDistance > 100) {
        await createChatWithMaid(id);
      }
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
          position: "absolute",
          bottom: 0,
          left: 0,
        }}
      >
        <h3>{name}</h3>
        <p>${pay}/hr — {range} mi range</p>
        <p>{languages}</p>
        {distance && <p>📍 {distance} mi from you</p>}
        {bio && (
          <p style={{ fontSize: "0.85rem", marginTop: "0.5rem", lineHeight: 1.4 }}>
             {bio.length > 120 ? bio.slice(0, 120) + '…' : bio}
          </p>
        )}
      </div>
    </motion.div>
  );
}

function TinderCards() {
  const [allCards, setAllCards] = useState([]);
  const [cards, setCards] = useState([]);
  const [topCardId, setTopCardId] = useState(null);
  const [swipedCards, setSwipedCards] = useState([]);
  const [swipeHistory, setSwipeHistory] = useState([]);
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
    window.scrollTo(0, 0);
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchMaidsAndSwipes(user);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchMaidsAndSwipes = async (currentUser) => {
    let swiped = [];

    try {
      const swipeDoc = await getDoc(doc(db, "swipes", currentUser.uid));
      if (swipeDoc.exists()) {
        swiped = swipeDoc.data().swiped || [];
      }
    } catch (err) {
      console.error("Error fetching swipes:", err);
    }

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

        if (isMaid && hasPhotos && !swiped.includes(uid)) {
          maidProfiles.push({
            id: uid,
            name: profileData.name || userData.name || "Unnamed",
            photo: profileData.photos[0],
            pay: profileData.pay || 0,
            range: profileData.range || 0,
            specs: profileData.specs || {},
            languages: profileData.languages || "",
            location: profileData.location || null,
            bio: profileData.bio || "", // ✅ Include bio
          });
        }
      }

      setAllCards(maidProfiles);
      setSwipedCards(swiped);
    } catch (err) {
      console.error("Error fetching maids:", err);
    }
  };

  useEffect(() => {
    const filtered = allCards.filter((maid) => {
      const specMatch = Object.entries(filters.specs).every(
        ([key, val]) => (val ? maid.specs?.[key] : true)
      );

      const langMatch =
        !filters.languages ||
        maid.languages?.toLowerCase().includes(filters.languages.toLowerCase());

      const payMatch =
        maid.pay >= filters.minPay && maid.pay <= filters.maxPay;

      const distanceMatch =
        !filters.location || !maid.location
          ? true
          : getDistanceInMiles(
              filters.location.lat,
              filters.location.lng,
              maid.location.lat,
              maid.location.lng
            ) <= filters.range;

      return specMatch && langMatch && payMatch && distanceMatch;
    });

    setCards(filtered);
    setTopCardId(filtered[filtered.length - 1]?.id || null);
  }, [filters, allCards]);

  const updateSwipedMaids = async (maidId) => {
    const user = getAuth().currentUser;
    if (!user) return;

    const updatedSwipes = [...new Set([...swipedCards, maidId])];
    setSwipedCards(updatedSwipes);
    setSwipeHistory((prev) => [...prev, maidId]);
    localStorage.setItem("swipedMaidIds", JSON.stringify(updatedSwipes));
    await saveSwipeToFirestore(user.uid, maidId);
  };

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
    await updateSwipedMaids(topCardId);
    const next = cards.filter((c) => c.id !== topCardId);
    setCards(next);
    setTopCardId(next[next.length - 1]?.id || null);
  };

  const handleDislike = async () => {
    if (!topCardId) return;
    await updateSwipedMaids(topCardId);
    const next = cards.filter((c) => c.id !== topCardId);
    setCards(next);
    setTopCardId(next[next.length - 1]?.id || null);
  };

  const handleRewind = async () => {
    if (swipeHistory.length === 0) return;
    const user = getAuth().currentUser;
    if (!user) return;

    const lastSwipedId = swipeHistory[swipeHistory.length - 1];

    try {
      await removeSwipeFromFirestore(user.uid, lastSwipedId);
      const updatedSwipes = swipedCards.filter((id) => id !== lastSwipedId);
      setSwipedCards(updatedSwipes);
      setSwipeHistory((prev) => prev.slice(0, -1));
      localStorage.setItem("swipedMaidIds", JSON.stringify(updatedSwipes));

      const maidProfileDoc = await getDoc(doc(db, "profiles", lastSwipedId));
      const userDoc = await getDoc(doc(db, "users", lastSwipedId));

      if (maidProfileDoc.exists() && userDoc.exists()) {
        const profileData = maidProfileDoc.data();
        const userData = userDoc.data();

        const reAdded = {
          id: lastSwipedId,
          name: profileData.name || userData.name || "Unnamed",
          photo: profileData.photos[0],
          pay: profileData.pay || 0,
          range: profileData.range || 0,
          specs: profileData.specs || {},
          languages: profileData.languages || "",
          location: profileData.location || null,
          bio: profileData.bio || "",
        };

        setAllCards((prev) => [...prev, reAdded]);
        setTopCardId(lastSwipedId);
      }
    } catch (err) {
      console.error("Error rewinding swipe:", err);
    }
  };

  const resetSwipes = async () => {
    const user = getAuth().currentUser;
    if (!user) return;

    try {
      await setDoc(doc(db, "swipes", user.uid), { swiped: [] });
      localStorage.removeItem("swipedMaidIds");
      setSwipedCards([]);
      setSwipeHistory([]);
      window.location.reload();
    } catch (err) {
      console.error("Failed to reset swipes:", err);
    }
  };

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
          {cards.length > 0 ? (
            cards.map((card) => (
              <Card
                key={card.id}
                {...card}
                setCards={setCards}
                cards={cards}
                userLocation={filters.location}
                updateSwipedMaids={updateSwipedMaids}
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

      <div style={{ textAlign: "center", marginTop: "1rem" }}>
        <button onClick={resetSwipes} style={{ padding: "0.5rem 1rem", background: "#ccc", borderRadius: "8px" }}>
          Reset Swipes
        </button>
      </div>
    </>
  );
}

export default TinderCards;
