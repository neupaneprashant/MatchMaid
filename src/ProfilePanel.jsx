import { useState, useEffect } from 'react';
import './ProfilePanel.css';
import { FaUserCircle } from 'react-icons/fa';
import { getAuth, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db, messaging } from './firebase';
import { getToken } from 'firebase/messaging';
import { useNavigate } from 'react-router-dom';
import MaidRatingAnalytics from './MaidRatingAnalytics';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingOverlay from './LoadingOverlay';
import React from 'react';

function ProfilePanel() {
  const auth = getAuth();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState('');
  const [pay, setPay] = useState(20);
  const [range, setRange] = useState(50);
  const [languages, setLanguages] = useState('');
  const [showAnalytics, setShowAnalytics] = useState(false);

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
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        try {
          const token = await getToken(messaging, {
            vapidKey: 'BOQSMeBPVm8y6nubk3l76nYInIX162YY5jCto9PHALX6vygSIPHLP8riMvbm0jj9eGXnajA4dN-DIvmTfgmbCWc'
          });
          await setDoc(doc(db, 'profiles', firebaseUser.uid), {
            fcmToken: token
          }, { merge: true });

        } catch (error) {
          console.error('❌ Error getting FCM token:', error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      setLoading(true);
      try {
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
      } catch (err) {
        toast.error("Failed to load profile.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (profileOpen && user) {
      loadProfile();
    }
  }, [profileOpen, user]);

  const saveProfile = async () => {
    if (!user) {
      toast.error("You're not logged in!");
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
      }, { merge: true });
      toast.success("✅ Profile saved!");
    } catch (err) {
      console.error('Error saving profile:', err);
      toast.error("❌ Failed to save profile.");
    }
  };

  const checkProfileInConsole = async () => {
    if (!user) return toast.info("User not logged in");
    try {
      const snap = await getDoc(doc(db, "profiles", user.uid));
      if (snap.exists()) {
        console.log("✅ Profile data:", snap.data());
      } else {
        console.log("⚠️ No profile found.");
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
      console.error("Logout error:", err);
      toast.error("Failed to log out.");
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
    <>
      <FaUserCircle
        onClick={() => setProfileOpen(!profileOpen)}
        size={32}
        style={{
          cursor: 'pointer',
          position: 'fixed',
          top: '1rem',
          left: '1rem',
          zIndex: 1100,
          color: profileOpen ? '#04AA6D' : '#ccc',
        }}
        title={profileOpen ? 'Close Profile' : 'Open Profile'}
      />

      {loading && <LoadingOverlay />}

      <div className={`profile-panel ${profileOpen ? 'open' : ''}`}>
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

        <br /><br />
        <button onClick={saveProfile}>Save Profile</button>
        <button style={{ marginLeft: '1rem' }} onClick={checkProfileInConsole}>
          🔍 Check Profile in Console
        </button>

        <br /><br />
        <button
          onClick={() => setShowAnalytics(!showAnalytics)}
          style={{
            backgroundColor: showAnalytics ? '#aaa' : '#04AA6D',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '0.25rem',
            marginBottom: '1rem',
            cursor: 'pointer'
          }}
        >
          {showAnalytics ? "Hide Rating Analytics" : "Show Rating Analytics"}
        </button>

        {showAnalytics && user && (
          <MaidRatingAnalytics maidId={user.uid} />
        )}

        <br /><br />
        <button
          onClick={handleLogout}
          style={{ backgroundColor: '#dc2626', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.25rem' }}
        >
          Log Out
        </button>
      </div>
    </>
  );
}

export default ProfilePanel;
