import { useState, useEffect } from 'react';
import './ProfilePanel.css';
import { getAuth, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import { useNavigate } from 'react-router-dom';
import React from 'react';

function ProfilePanel({ open, setOpen, onFilterChange }) {
  const auth = getAuth();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [minPay, setMinPay] = useState(0);
  const [maxPay, setMaxPay] = useState(100);
  const [range, setRange] = useState(50);
  const [languages, setLanguages] = useState('');
  const [favoriteMaids, setFavoriteMaids] = useState([]);
  const [location, setLocation] = useState(null);

  const [specs, setSpecs] = useState({
    pets: false,
    kitchen: false,
    outdoors: false,
    bathroom: false,
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchFavoriteMaids = async () => {
      if (!user) return;
      const userRef = doc(db, 'users', user.uid);
      const snap = await getDoc(userRef);
      if (!snap.exists()) return;

      const data = snap.data();
      const favorites = data.favorites || [];
      const fetched = [];

      for (let maidId of favorites) {
        const profileSnap = await getDoc(doc(db, 'profiles', maidId));
        const userSnap = await getDoc(doc(db, 'users', maidId));

        if (profileSnap.exists() || userSnap.exists()) {
          fetched.push({
            id: maidId,
            name: profileSnap.data().name || userSnap.data().name || 'Unnamed',
            avatar:
              profileSnap.data().photos?.[0] ||
              userSnap.data().photoURL ||
              'https://i.pravatar.cc/150?u=' + maidId,
          });
        }
      }

      setFavoriteMaids(fetched);
    };

    if (open && user) {
      fetchFavoriteMaids();
    }
  }, [open, user]);

  useEffect(() => {
    if (onFilterChange) {
      onFilterChange({
        range,
        specs,
        languages,
        minPay,
        maxPay,
        location,
      });
    }
  }, [range, specs, languages, minPay, maxPay, location]);

  const toggleSpec = (key) => {
    setSpecs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const resetFilters = () => {
    setRange(50);
    setMinPay(0);
    setMaxPay(100);
    setLanguages('');
    setSpecs({
      pets: false,
      kitchen: false,
      outdoors: false,
      bathroom: false,
    });
    setLocation(null);
  };

  const handleGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setLocation({ lat: latitude, lng: longitude });
        },
        (err) => {
          console.error('Geolocation error:', err.message);
          alert('Failed to get location');
        }
      );
    } else {
      alert('Geolocation not supported by this browser');
    }
  };

  return (
    <div className={`profile-panel ${open ? 'open' : ''}`}>
      <h2>Filter Maids</h2>

      <p><strong>Languages:</strong></p>
      <input
        type="text"
        placeholder="e.g. English, Spanish"
        value={languages}
        onChange={(e) => setLanguages(e.target.value)}
      />

      <p><strong>Hourly Pay Range ($):</strong></p>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          type="number"
          value={minPay}
          min={0}
          onChange={(e) => setMinPay(Number(e.target.value))}
          placeholder="Min"
        />
        <input
          type="number"
          value={maxPay}
          min={0}
          onChange={(e) => setMaxPay(Number(e.target.value))}
          placeholder="Max"
        />
      </div>

      <p><strong>Work Specifications:</strong></p>
      {Object.keys(specs).map((key) => (
        <button
          key={key}
          className={`spec-pill ${specs[key] ? 'active' : ''}`}
          onClick={() => toggleSpec(key)}
        >
          {key.charAt(0).toUpperCase() + key.slice(1)}
        </button>
      ))}

      <br /><br />
      <button onClick={handleGeolocation}>📍 Use My Location</button>
      <br /><br />

      <button onClick ={() => navigate("/chat")}> Chat </button>
      <button onClick={resetFilters} style={{ backgroundColor: '#999' }}>
        Reset Filters
      </button>

      <br /><br />
      <p><strong>Favorites:</strong></p>
      <div>
        {favoriteMaids.length === 0 ? (
          <p>No favorites yet</p>
        ) : (
          favoriteMaids.map((maid) => (
            <div
              key={maid.id}
              className="favorite-maid"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.5rem',
                cursor: 'pointer'
              }}
              onClick={() => navigate(`/chat?maidId=${maid.id}`)}
            >
              <img
                src={maid.avatar}
                alt={maid.name}
                style={{ width: 36, height: 36, borderRadius: '50%' }}
              />
              <span>{maid.name}</span>
            </div>
          ))
        )}
      </div>

      <br /><br />
      <button
        onClick={() => window.location.href = '/'}
        style={{ backgroundColor: '#dc2626', color: 'white' }}
      >
        Log Out
      </button>
    </div>
  );
}

export default ProfilePanel;
