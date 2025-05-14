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
  serverTimestamp
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

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
      if (data.users.includes(maidId)) return; // Chat already exists
    }

    const newChatRef = doc(collection(db, "chats"));
    await setDoc(newChatRef, {
      users: [currentUser.uid, maidId],
      createdAt: serverTimestamp(),
    });
    console.log("New chat created between:", currentUser.uid, "and", maidId);
  } catch (err) {
    console.error("Failed to create chat:", err);
  }
};

function Card({ id, photo, name, pay, range, setCards, cards, onMatch }) {
  const x = useMotionValue(0);
  const rotateBase = useTransform(x, [-150, 150], [-18, 18]);
  const opacity = useTransform(x, [-150, 0, 150], [0, 1, 0]);

  const isFront = id === cards[cards.length - 1].id;
  const offset = isFront ? 0 : id % 2 ? 6 : -6;
  const rotate = useTransform(rotateBase, (r) => `${r + offset}deg`);

  const handleDragEnd = () => {
    const swipeDistance = x.get();

    if (swipeDistance > 100) {
      onMatch(id); // ✅ delegate to parent
    }

    if (Math.abs(swipeDistance) > 100) {
      setCards((prev) => prev.filter((card) => card.id !== id));
    }
  };

  return (
    <motion.div
      className="card"
      style={{ x, rotate, opacity, scale: isFront ? 0.9 : 0.85 }}
      animate={{ scale: isFront ? 0.9 : 0.85 }}
      drag={isFront ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
    >
      <img src={photo} alt="maid card" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "20px" }} />
      <div className="cardtext">
        <h3>{name}</h3>
        <p>${pay}/hr — {range} mi range</p>
      </div>
    </motion.div>
  );
}

function TinderCards() {
  const [cards, setCards] = useState([]);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
  const fetchMaids = async () => {
  try {
    const profileSnapshot = await getDocs(collection(db, "profiles"));
    const maidProfiles = [];

    for (const docSnap of profileSnapshot.docs) {
      const profileData = docSnap.data();
      const uid = docSnap.id;

      // Fetch corresponding user document
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
        });
      }
    }
    console.log("✅ Maid profiles to show:", maidProfiles);
    setCards(maidProfiles);
  } catch (err) {
    console.error("Error fetching maid profiles with user roles:", err);
  }
};

  fetchMaids();
}, []);

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
        title={profileOpen ? "Close Profile" : "Open Profile"}
      />

      <ProfilePanel open={profileOpen} setOpen={setProfileOpen} />

      <div className={`main-content ${profileOpen ? "shifted" : ""}`}>
        <div className="tinderCards__cardContainer">
          {cards.map((card) => (
            <Card key={card.id} {...card} setCards={setCards} cards={cards}  onMatch={createChatWithMaid}/>
          ))}
        </div>
      </div>
    </>
  );
}

export default TinderCards;
