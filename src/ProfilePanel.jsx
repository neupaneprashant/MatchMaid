import { useState, useEffect } from 'react';
import './ProfilePanel.css';
import { getAuth, signOut } from 'firebase/auth';
import { collection, doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import { useNavigate } from 'react-router-dom';
import React from 'react';

function ProfilePanel({ open, setOpen }) {
  const auth = getAuth();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [pay, setPay] = useState(20);
  const [range, setRange] = useState(50);
  const [languages, setLanguages] = useState('');
  const [favoriteMaids, setFavoriteMaids] = useState([]);

  const [specs, setSpecs] = useState({
    pets: false,
    kitchen: false,
    outdoors: false,
    bathroom: false,
  });

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const [schedule, setSchedule] = useState({
    Mon: { active: false, start: '08:00', end: '16:00' },
    Tue: { active: false, start: '08:00', end: '16:00' },
    Wed: { active: false, start: '08:00', end: '16:00' },
    Thu: { active: false, start: '08:00', end: '16:00' },
    Fri: { active: false, start: '08:00', end: '16:00' },
    Sat: { active: false, start: '08:00', end: '16:00' },
    Sun: { active: false, start: '08:00', end: '16:00' },
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;

      const profileRef = doc(db, 'profiles', user.uid);
      const snap = await getDoc(profileRef);
      if (snap.exists()) {
        const data = snap.data();
        setName(data.name || '');
        setPay(data.pay || 20);
        setRange(data.range || 50);
        setSpecs(data.specs || specs);
        setSchedule(data.schedule || schedule);
        setLanguages(data.languages || '');
      }
    };

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
      loadProfile();
      fetchFavoriteMaids();
    }
  }, [open, user]);

  const saveProfile = async () => {
    if (!user) {
      alert("You're not logged in!");
      return;
    }

    try {
      await setDoc(doc(db, 'profiles', user.uid), {
        name,
        pay,
        range,
        specs,
        schedule,
        languages,
      });
      alert('Profile saved!');
    } catch (err) {
      alert(`Failed to save profile: ${err.message}`);
    }
  };

  const checkProfileInConsole = async () => {
    if (!user) return alert("User not logged in");
    try {
      const snap = await getDoc(doc(db, 'profiles', user.uid));
      if (snap.exists()) {
        console.log("✅ Profile data loaded from Firestore:", snap.data());
      } else {
        console.log("⚠️ No profile found for this user.");
      }
    } catch (err) {
      console.error("Error checking profile:", err);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (err) {
      alert("Failed to log out.");
    }
  };

  const toggleSpec = (key) => {
    setSpecs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleDay = (day) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], active: !prev[day].active },
    }));
  };

  const updateTime = (day, field, value) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  };

  return (
    <div className={`profile-panel ${open ? 'open' : ''}`}>
      <h2>Your Maid Profile</h2>

      <p><strong>Name:</strong></p>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} />

      <p><strong>Hourly Pay ($):</strong></p>
      <input type="number" value={pay} onChange={(e) => setPay(Number(e.target.value))} />

      <p><strong>Work Range (mi):</strong></p>
      <div className="slidecontainer">
        <input
          type="range"
          min="1"
          max="100"
          value={range}
          className="slider"
          onChange={(e) => setRange(Number(e.target.value))}
        />
        <p>{range} mi</p>
      </div>

      <p><strong>Weekly Availability:</strong></p>
      {daysOfWeek.map((day) => (
        <div key={day} style={{ marginBottom: '1rem' }}>
          <button
            className={`spec-pill ${schedule[day].active ? 'active' : ''}`}
            onClick={() => toggleDay(day)}
          >
            {day}
          </button>
          {schedule[day].active && (
            <>
              <label style={{ marginLeft: '0.5rem' }}>
                Start:
                <input
                  type="time"
                  value={schedule[day].start}
                  onChange={(e) => updateTime(day, 'start', e.target.value)}
                />
              </label>
              <label style={{ marginLeft: '1rem' }}>
                End:
                <input
                  type="time"
                  value={schedule[day].end}
                  onChange={(e) => updateTime(day, 'end', e.target.value)}
                />
              </label>
            </>
          )}
        </div>
      ))}

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

      <p><strong>Languages Spoken (optional):</strong></p>
      <input
        type="text"
        placeholder="e.g. English, Spanish, Tagalog"
        value={languages}
        onChange={(e) => setLanguages(e.target.value)}
      />

      <p><strong>Favorites:</strong></p>
      <div>
        {favoriteMaids.length === 0 ? (
          <p>No favorites yet</p>
        ) : (
          favoriteMaids.map((maid) => (
            <div
              key={maid.id}
              className="favorite-maid"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', cursor: 'pointer' }}
              onClick={() => navigate(`/chat?maidId=${maid.id}`)}
            >
              <img src={maid.avatar} alt={maid.name} style={{ width: 36, height: 36, borderRadius: '50%' }} />
              <span>{maid.name}</span>
            </div>
          ))
        )}
      </div>

      <br />
      <button onClick={saveProfile}>Save Profile</button>
      <button onClick={()=> navigate("/chat")}> Chat </button>
      <button style={{ marginLeft: '1rem' }} onClick={checkProfileInConsole}>🔍 Check Profile in Console</button>
      <br /><br />
      <button
        onClick={handleLogout}
        style={{ backgroundColor: '#dc2626', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.25rem' }}
      >
        Log Out
      </button>
    </div>
  );
}

export default ProfilePanel;
