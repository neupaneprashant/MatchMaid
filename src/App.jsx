import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import LandingPage from './landing';
import Signup from './Signup';
import TinderCards from './Tinder_Cards';
import './App.css';
import './signup.css';
import './landing.css';
import './Tinder_Cards.css';
import ReviewSection from './ReviewSection'; 
import MaidPortal from './MaidPortal';
import ChatPage from './ChatPage'; // Assuming you have a ChatPage component for chat functionality
import ProfilePage from './MaidPage';
import MyReviews from './MyReviews'; // Assuming you have a MyReviews component for displaying user reviews
import React from 'react';

function App() {
  return (
    <PayPalScriptProvider options={{ "client-id": "AaWfHrfQT8-xfjy-UFHZmtNG2XkN1_OPeIapYMMazZGq16GRLXamgDQJh3fMHcpah-QW4edYzxmnzwXM" }}>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<TinderCards />} />
          <Route path="/tinder-shuffle/review" element={<ReviewSection />} />
          <Route path="/maid-portal" element={<MaidPortal />} />
          <Route path="/maid-chat" element={<ChatPage />} />
          <Route path="/maid-schedule" element={<ProfilePage />} />
          <Route path="/my-reviews" element={<MyReviews />} />



        </Routes>
      </Router>
    </PayPalScriptProvider>
  );
}

export default App;
