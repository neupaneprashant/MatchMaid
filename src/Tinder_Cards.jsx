import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import ProfilePanel from "./ProfilePanel";
import { FaUserCircle } from "react-icons/fa";
import "./Tinder_Cards.css";
import PayPalButton from "./Pay_Pal";
import { db, auth } from "./firebase";
import { collection, getDocs, query, where, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

function Card({ id, url, setCards, cards, handleSwipeRight }) {
  const x = useMotionValue(0);
  const rotateBase = useTransform(x, [-150, 150], [-18, 18]);
  const opacity = useTransform(x, [-150, 0, 150], [0, 1, 0]);

  const isFront = id === cards[cards.length - 1].id;
  const offset = isFront ? 0 : id % 2 ? 6 : -6;
  const rotate = useTransform(rotateBase, (r) => `${r + offset}deg`);

  const handleDragEnd = async () => {
    if (x.get() > 100) {
      await handleSwipeRight(id);
    }

    if (Math.abs(x.get()) > 100) {
      setCards((prev) => prev.filter((card) => card.id !== id));
    }
  };

  return (
    <motion.img
      src={url}
      alt="maid card"
      className="card"
      style={{
        x,
        rotate,
        opacity,
        boxShadow: isFront
          ? "0 20px 25px -5px rgb(0 0 0 / 0.5), 0 8px 10px -6px rgb(0 0 0 / 0.5)"
          : undefined,
      }}
      animate={{ scale: isFront ? 1 : 0.98 }}
      drag={isFront ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
    />
  );
}

function TinderCards() {
  const [cards, setCards] = useState([]);
  const [profileOpen, setProfileOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) setCurrentUser({ userId: user.uid });
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    setCards([
      { id: "maid1", url: "IMG_0052.png" },
      { id: "maid2", url: "IMG_0054.jpg" },
      { id: "maid3", url: "IMG_0057.jpg" },
      { id: "maid4", url: "IMG_0059.jpg" },
    ]);
  }, []);

  const handleSwipeRight = async (maidUserId) => {
    if (!currentUser || !maidUserId) return;

    try {
      const chatQuery = query(
        collection(db, "chats"),
        where("users", "array-contains", currentUser.userId)
      );
      const snapshot = await getDocs(chatQuery);

      const chatExists = snapshot.docs.some((doc) =>
        doc.data().users.includes(maidUserId)
      );

      if (chatExists) return;

      const newChatRef = doc(collection(db, "chats"));
      await setDoc(newChatRef, {
        users: [currentUser.userId, maidUserId],
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error creating chat:", error);
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
        title={profileOpen ? "Close Profile" : "Open Profile"}
      />

      <ProfilePanel open={profileOpen} setOpen={setProfileOpen} />

      <div className={`main-content ${profileOpen ? "shifted" : ""}`}>
        <div className="tinderCards__cardContainer">
          {cards.map((card) => (
            <Card
              key={card.id}
              {...card}
              setCards={setCards}
              cards={cards}
              handleSwipeRight={handleSwipeRight}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default TinderCards;
