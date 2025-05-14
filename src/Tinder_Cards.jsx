import React, { useState, useEffect } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import ProfilePanel from "./ProfilePanel";
import { FaUserCircle } from "react-icons/fa";
import "./Tinder_Cards.css";
import PayPalButton from "./Pay_Pal";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

// 🔢 Distance between two lat/lng points (miles)
function getDistanceInMiles(lat1, lon1, lat2, lon2) {
  const R = 3958.8; // Earth radius in miles
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

function Card({ id, photo, name, pay, range, specs, languages, location, userLocation, setCards, cards }) {
  const x = useMotionValue(0);
  const rotateBase = useTransform(x, [-150, 150], [-18, 18]);
  const opacity = useTransform(x, [-150, 0, 150], [0, 1, 0]);

  const isFront = id === cards[cards.length - 1]?.id;
  const offset = isFront ? 0 : id % 2 ? 6 : -6;
  const rotate = useTransform(rotateBase, (r) => `${r + offset}deg`);

  const handleDragEnd = () => {
    if (Math.abs(x.get()) > 100) {
      setCards((prev) => prev.filter((card) => card.id !== id));
    }
  };

  const distance = userLocation && location
    ? getDistanceInMiles(userLocation.lat, userLocation.lng, location.lat, location.lng).toFixed(1)
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
          borderRadius: "20px"
        }}
      />
      <div className="cardtext">
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
  const [profileOpen, setProfileOpen] = useState(false);
  const [filters, setFilters] = useState({
    range: 50,
    pay: 0,
    specs: {},
    languages: '',
    location: null
  });

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
              range: data.range || 0,
              specs: data.specs || {},
              languages: data.languages || '',
              location: data.location || null
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

  const applyFilters = (maids) => {
    return maids.filter((maid) => {
      const specMatch = Object.entries(filters.specs).every(([key, val]) =>
        val ? maid.specs?.[key] : true
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
  };

  const filteredCards = applyFilters(cards);

  return (
    <>
      {/* PayPal Button */}
      <div className="top-right-button">
        <PayPalButton />
      </div>

      {/* Profile icon toggle */}
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

      {/* Filter panel */}
      <ProfilePanel open={profileOpen} setOpen={setProfileOpen} onFilterChange={setFilters} />

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
              />
            ))
          ) : (
            <div style={{ textAlign: "center", color: "#666", marginTop: "2rem" }}>
              <p>No maids match your filters.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default TinderCards;
