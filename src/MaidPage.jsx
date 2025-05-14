import React, { useState, useEffect } from 'react';
import { getAuth, deleteUser } from 'firebase/auth';
import { doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';
import './ProfilePanel.css';

function ProfilePage() {
  const auth = getAuth();
  const user = auth.currentUser;

  const [name, setName] = useState('');
  const [pay, setPay] = useState(20);
  const [range, setRange] = useState(50);
  const [languages, setLanguages] = useState('');
  const [location, setLocation] = useState(null);
  const [photos, setPhotos] = useState([]);

  const [specs, setSpecs] = useState({
    pets: false,
    kitchen: false,
    outdoors: false,
    bathroom: false,
  });

  const [schedule, setSchedule] = useState({
    Mon: { active: false, start: '08:00', end: '16:00' },
    Tue: { active: false, start: '08:00', end: '16:00' },
    Wed: { active: false, start: '08:00', end: '16:00' },
    Thu: { active: false, start: '08:00', end: '16:00' },
    Fri: { active: false, start: '08:00', end: '16:00' },
    Sat: { active: false, start: '08:00', end: '16:00' },
    Sun: { active: false, start: '08:00', end: '16:00' },
  });

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

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation({ lat: latitude, lng: longitude });
      },
      (err) => {
        console.error("Geolocation error:", err.message);
        alert("Failed to get location.");
      }
    );
  };

  const saveProfile = async () => {
    if (!user?.uid) return alert("User not signed in");

    const profileData = {
      name,
      pay,
      range,
      languages,
      specs,
      schedule,
      photos,
      ...(location && { location }),
    };

    try {
      await setDoc(doc(db, "profiles", user.uid), profileData);

      const updates = {};
      if (photos.length > 0) updates.photoURL = photos[0];
      if (name.trim()) updates.name = name;

      if (Object.keys(updates).length > 0) {
        await setDoc(doc(db, "users", user.uid), updates, { merge: true });
      }

      alert("Profile saved!");
    } catch (err) {
      console.error("Error saving profile:", err);
      alert("Failed to save profile.");
    }
  };

  const deleteAccount = async () => {
    if (!user) return alert("No user signed in.");

    if (!window.confirm("Are you sure you want to delete your account?")) {
      return;
    }

    try {
      await deleteDoc(doc(db, "profiles", user.uid));
      await deleteUser(user);
      alert("Account deleted successfully.");
      window.location.href = "/";
    } catch (err) {
      console.error("Error deleting account:", err);
      alert(err.message || "Failed to delete account.");
    }
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    const readers = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then((images) => {
      setPhotos((prev) => [...prev, ...images]);
    });
  };

  const removePhoto = (indexToRemove) => {
    setPhotos((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.uid) return;

      const snap = await getDoc(doc(db, "profiles", user.uid));
      if (snap.exists()) {
        const data = snap.data();
        setName(data.name || '');
        setPay(data.pay || 20);
        setRange(data.range || 50);
        setLanguages(data.languages || '');
        setSpecs(data.specs || specs);
        setSchedule(data.schedule || schedule);
        setPhotos(data.photos || []);
        setLocation(data.location || null);
      }
    };

    loadProfile();
  }, []);

  return (
    <div className="profile-page">
      <h1>Your Maid Profile</h1>

      <label>Name:</label>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} />

      <label>Hourly Pay ($):</label>
      <input type="number" value={pay} onChange={(e) => setPay(Number(e.target.value))} />

      <label>Work Range (mi):</label>
      <input type="range" min="1" max="100" value={range} onChange={(e) => setRange(Number(e.target.value))} />
      <p>{range} mi</p>

      <button onClick={handleGeolocation}>Set My Location</button>
      {location && (
        <p style={{ fontSize: '0.9rem', color: '#444' }}>
          📍 Location set: {location.lat.toFixed(3)}, {location.lng.toFixed(3)}
        </p>
      )}

      <label>Weekly Availability:</label>
      {Object.keys(schedule).map((day) => (
        <div key={day} style={{ marginBottom: '1rem' }}>
          <button className={`spec-pill ${schedule[day].active ? 'active' : ''}`} onClick={() => toggleDay(day)}>
            {day}
          </button>
          {schedule[day].active && (
            <>
              <label style={{ marginLeft: '0.5rem' }}>
                Start:
                <input type="time" value={schedule[day].start} onChange={(e) => updateTime(day, 'start', e.target.value)} />
              </label>
              <label style={{ marginLeft: '1rem' }}>
                End:
                <input type="time" value={schedule[day].end} onChange={(e) => updateTime(day, 'end', e.target.value)} />
              </label>
            </>
          )}
        </div>
      ))}

      <label>Work Specifications:</label>
      {Object.keys(specs).map((key) => (
        <button key={key} className={`spec-pill ${specs[key] ? 'active' : ''}`} onClick={() => toggleSpec(key)}>
          {key.charAt(0).toUpperCase() + key.slice(1)}
        </button>
      ))}

      <label>Languages Spoken (optional):</label>
      <input type="text" placeholder="e.g. English, Spanish" value={languages} onChange={(e) => setLanguages(e.target.value)} />

      <label>Upload Photos:</label>
      <input type="file" multiple onChange={handlePhotoUpload} accept="image/*" />
      <div className="photo-preview">
        {photos.map((src, i) => (
          <div key={i} style={{ display: 'inline-block', position: 'relative', marginRight: '1rem', marginTop: '1rem' }}>
            <img src={src} alt={`preview-${i}`} style={{ width: '100px', borderRadius: '8px' }} />
            <button
              onClick={() => removePhoto(i)}
              style={{
                position: 'absolute',
                top: '0',
                right: '0',
                width: '20px',
                height: '20px',
                background: 'white',
                color: 'red',
                border: '1px solid red',
                borderRadius: '50%',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer',
                padding: 0,
                textAlign: 'center',
                lineHeight: '20px',
              }}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <br /><br />
      <button onClick={saveProfile}>Save Profile</button>
      <br /><br />
      <button onClick={deleteAccount} style={{ backgroundColor: 'red', color: 'white' }}>Delete Account</button>
    </div>
  );
}

export default ProfilePage;
