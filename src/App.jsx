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
import React from 'react';
import ChatPage from './ChatPage';

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
          <Route path="/chat" element={<ChatPage />} />
        </Routes>
      </Router>
    </PayPalScriptProvider>
  );
}

export default App;
