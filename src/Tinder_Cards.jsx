import React, { useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import ProfilePanel from "./ProfilePanel"; 
import { FaUserCircle } from "react-icons/fa"; 
import "./Tinder_Cards.css";
import PayPalButton from "./Pay_Pal";
import { db } from "./firebase";
import { collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  doc, 
  setDoc, 
  serverTimestamp } from "firebase/firestore";


const cardData = [
  {
    id: 1,
    url: "IMG_0052.png",
  },
  {
    id: 2,
    url: "IMG_0054.jpg",
  },
  {
    id: 3,
    url: "IMG_0057.jpg",
  },
  {
    id: 4,
    url: "IMG_0059.jpg",
  },
];

function Card({ id, url, setCards, cards, currentUser, handleSwipeRight }) {
  const x = useMotionValue(0);
  const rotateBase = useTransform(x, [-150, 150], [-18, 18]);
  const opacity = useTransform(x, [-150, 0, 150], [0, 1, 0]);

  const isFront = id === cards[cards.length - 1].id;
  const offset = isFront ? 0 : id % 2 ? 6 : -6;
  const rotate = useTransform(rotateBase, (r) => `${r + offset}deg`);

  ////////modificatinos: keep//////////
  const handleDragEnd = async () => {
    if (x.get() > 100) {
      // Swipe right - initialize chat
      await handleSwipeRight(id); // Pass maid ID
    }
  
    if (Math.abs(x.get()) > 100) {
      setCards((prev) => prev.filter((card) => card.id !== id));
    }
  };

  const handleSwipeRight = async (maidId) => {
    if (!currentUser || !maidId) return;
  
    try {
      // Check for existing chat
      const chatQuery = query(collection(db, "chats"), where("users", "array-contains", currentUser.uid));
      const snapshot = await getDocs(chatQuery);
  
      const chatExists = snapshot.docs.find(doc => {
        const users = doc.data().users;
        return users.includes(maidId);
      });
  
      if (chatExists) return; // Already exists
  
      // Create new chat
      const newChatRef = doc(collection(db, "chats"));
      await setDoc(newChatRef, {
        users: [currentUser.uid, maidId],
        createdAt: serverTimestamp()
      });
  
      // Optional: You could also store a record in a "swipes" collection if needed
  
    } catch (error) {
      console.error("Error creating chat:", error);
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
  const [cards, setCards] = useState(cardData);
  const [profileOpen, setProfileOpen] = useState(false); // Panel toggle

  return (
    <>
      {/* PayPal Button */}
      <div className="top-right-button">
        <PayPalButton />
      </div>
    
      {/* Profile icon button */}
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

      {/* Profile editor panel */}
      <ProfilePanel open={profileOpen} setOpen={setProfileOpen} />

      {/* WRAP CONTENT IN MAIN-CONTENT */}
      <div className={`main-content ${profileOpen ? "shifted" : ""}`}>
        <div className="tinderCards__cardContainer">
          {cards.map((card) => (
            <Card key={card.id} {...card} setCards={setCards} cards={cards} currentUser={currentUser} handleSwipeRight={handleSwipeRight} />
          ))}
        </div>
      </div>
    </>
  );
}


export default TinderCards;