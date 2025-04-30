import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './landing';
import Signup from './Signup';
import TinderCards from './Tinder_Cards';
import ReviewSection from './ReviewSection';
import MyReviews from './MyReviews';
import Bookings from './Bookings';
import ChatPage from './ChatPage';
import MaidPage from './MaidPage';

import './App.css';
import './signup.css';
import './landing.css';
import './Tinder_Cards.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/tinder" element={<TinderCards />} />
        <Route path="/home" element={<TinderCards />} /> 
        <Route path="/tinder-shuffle/review" element={<ReviewSection />} />        
        <Route path="/my-reviews" element={<MyReviews />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/chat" element={<ChatPage />} /> 
        <Route path="/maidpage" element={<MaidPage />} />
        <Route path="/profile" element={<ProfilePage/>}/>
      </Routes>
    </Router>
  );
}

export default App;

