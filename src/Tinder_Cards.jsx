import React, { useState, useEffect } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import ProfilePanel from "./ProfilePanel"; 
import { FaUserCircle } from "react-icons/fa"; 
import "./Tinder_Cards.css";
import PayPalButton from "./Pay_Pal";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

function Card({ id, photo, name, pay, range, setCards, cards }) {
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
        const querySnapshot = await getDocs(collection(db, "profiles"));
        const maidProfiles = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.photos?.length > 0) {
            maidProfiles.push({
              id: doc.id,
              name: data.name || "Unnamed",
              photo: data.photos[0],
              pay: data.pay || 0,
              range: data.range || 0
            });
          }
        });
        setCards(maidProfiles);
      } catch (err) {
        console.error("Error fetching profiles:", err);
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
            <Card key={card.id} {...card} setCards={setCards} cards={cards} />
          ))}
        </div>
      </div>
    </>
  );
}

export default TinderCards;
