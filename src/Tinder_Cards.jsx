import React, { useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import ProfilePanel from "./ProfilePanel"; 
import { FaUserCircle } from "react-icons/fa"; 
import "./Tinder_Cards.css";
import PayPalButton from "./Pay_Pal";

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

function Card({ id, url, setCards, cards }) {
  const x = useMotionValue(0);
  const rotateBase = useTransform(x, [-150, 150], [-18, 18]);
  const opacity = useTransform(x, [-150, 0, 150], [0, 1, 0]);

  const isFront = id === cards[cards.length - 1].id;
  const offset = isFront ? 0 : id % 2 ? 6 : -6;
  const rotate = useTransform(rotateBase, (r) => `${r + offset}deg`);

  const handleDragEnd = () => {
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
            <Card key={card.id} {...card} setCards={setCards} cards={cards} />
          ))}
        </div>
      </div>
    </>
  );
}


export default TinderCards;