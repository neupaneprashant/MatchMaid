import React from 'react'
import { useState, useEffect } from 'react'
import { getAuth } from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { db } from './firebase'
import './ProfilePanel.css'
import { deleteUser } from "firebase/auth";
import { deleteDoc } from "firebase/firestore";

function ProfilePage() {
  const auth = getAuth()
  const user = auth.currentUser

  const [name, setName] = useState('')
  const [pay, setPay] = useState(20)
  const [range, setRange] = useState(50)
  const [languages, setLanguages] = useState('')
  const [specs, setSpecs] = useState({
    pets: false,
    kitchen: false,
    outdoors: false,
    bathroom: false,
  })
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const [schedule, setSchedule] = useState({
    Mon: { active: false, start: '08:00', end: '16:00' },
    Tue: { active: false, start: '08:00', end: '16:00' },
    Wed: { active: false, start: '08:00', end: '16:00' },
    Thu: { active: false, start: '08:00', end: '16:00' },
    Fri: { active: false, start: '08:00', end: '16:00' },
    Sat: { active: false, start: '08:00', end: '16:00' },
    Sun: { active: false, start: '08:00', end: '16:00' },
  })

  const [photos, setPhotos] = useState([])

  const toggleSpec = (key) => setSpecs(prev => ({ ...prev, [key]: !prev[key] }))
  const toggleDay = (day) => setSchedule(prev => ({ ...prev, [day]: { ...prev[day], active: !prev[day].active } }))
  const updateTime = (day, field, value) => setSchedule(prev => ({ ...prev, [day]: { ...prev[day], [field]: value } }))

  const saveProfile = async () => {
    if (!user?.uid) return alert("User not signed in")
    await setDoc(doc(db, "profiles", user.uid), {
      name,
      pay,
      range,
      languages,
      specs,
      schedule,
      photos
    })
    alert("Profile saved!")
  }

  const deleteAccount = async () => {
    if (!user) return alert("No user signed in.");
  
    if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return;
    }
  
    try {
      // Delete user profile document from Firestore
      await deleteDoc(doc(db, "profiles", user.uid));
  
      // Delete the user from Firebase Authentication
      await deleteUser(user);
  
      alert("Account deleted successfully.");
      window.location.href = "/"; // Redirect to signup page or homepage
    } catch (error) {
      console.error("Error deleting account:", error);
      alert(error.message || "Failed to delete account.");
    }
  };
  

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files)
    const readers = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.readAsDataURL(file)
      })
    })
    Promise.all(readers).then(images => {
      setPhotos(prev => [...prev, ...images])
    })
  }

  const removePhoto = (indexToRemove) => {
    setPhotos(prev => prev.filter((_, index) => index !== indexToRemove))
  }

  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.uid) return
      const docSnap = await getDoc(doc(db, "profiles", user.uid))
      if (docSnap.exists()) {
        const data = docSnap.data()
        setName(data.name || '')
        setPay(data.pay || 20)
        setRange(data.range || 50)
        setLanguages(data.languages || '')
        setSpecs(data.specs || specs)
        setSchedule(data.schedule || schedule)
        setPhotos(data.photos || [])
      }
    }
    loadProfile()
  }, [])

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

      <label>Weekly Availability:</label>
      {daysOfWeek.map(day => (
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
    textAlign: 'center',      // Center text horizontally
    lineHeight: '20px',        // Center text vertically by matching line height to height
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
  )
}
export default ProfilePage