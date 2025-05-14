import { useState, useEffect } from 'react';
import './ProfilePanel.css';
import React from 'react';

function ProfilePanel({ open, setOpen, onFilterChange }) {
  const [range, setRange] = useState(50);
  const [pay, setPay] = useState(0);
  const [languages, setLanguages] = useState('');
  const [specs, setSpecs] = useState({
    pets: false,
    kitchen: false,
    outdoors: false,
    bathroom: false,
  });
  const [location, setLocation] = useState(null);

  const toggleSpec = (key) => {
    setSpecs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const resetFilters = () => {
    setRange(50);
    setPay(0);
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

  useEffect(() => {
    onFilterChange({ range, specs, languages, pay, location });
  }, [range, specs, languages, pay, location]);

  return (
    <div className={`profile-panel ${open ? 'open' : ''}`}>
      <h2>Filter Maids</h2>

      <p><strong>Max Distance (mi):</strong></p>
      <input
        type="range"
        min="1"
        max="100"
        value={range}
        onChange={(e) => setRange(Number(e.target.value))}
      />
      <p>{range} mi</p>

      <p><strong>Minimum Hourly Pay ($):</strong></p>
      <input
        type="number"
        value={pay}
        onChange={(e) => setPay(Number(e.target.value))}
      />

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

      <p><strong>Languages:</strong></p>
      <input
        type="text"
        placeholder="e.g. English, Spanish"
        value={languages}
        onChange={(e) => setLanguages(e.target.value)}
      />

      <br /><br />
      <button onClick={handleGeolocation}>Use My Location</button>
      <br /><br />
      <button onClick={resetFilters} style={{ backgroundColor: '#999' }}>
        Reset Filters
      </button>
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
