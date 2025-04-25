import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './landing';
import Signup from './Signup';
import TinderCards from './Tinder_Cards';
import './App.css';
import './signup.css';
import './landing.css';
import './Tinder_Cards.css';
import ReviewSection from './ReviewSection'; 
import React from 'react';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<TinderCards />} />
        <Route path="/tinder-shuffle/review" element={<ReviewSection />} />
        <Route path="/products" element={<TinderCards />} />
        <Route path="/learn" element={<TinderCards />} />
        <Route path="/safety" element={<TinderCards />} />
        <Route path="/support" element={<TinderCards />} />
        <Route path="/download" element={<TinderCards />} />
      </Routes>
    </Router>
  );
}

export default App;
