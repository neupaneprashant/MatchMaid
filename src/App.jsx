import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import LandingPage from './landing';
import Signup from './Signup';
import TinderCards from './Tinder_Cards';
import ChatPage from './ChatPage';
import ReviewSection from './ReviewSection';
import ProductsPage from './products';
import LearnPage from './learn';
import SafetyPage from './safety';
import ChatbaseIframe from './ChatbaseIframe'; // Replaces SupportPage
import MaidPortal from './MaidPortal';
import ProfilePage from './MaidPage';

// CSS imports
import './App.css';
import './signup.css';
import './landing.css';
import './Tinder_Cards.css';
import './ChatPage.css';

function App() {
  return (
    <PayPalScriptProvider options={{ "client-id": "AaWfHrfQT8-xfjy-UFHZmtNG2XkN1_OPeIapYMMazZGq16GRLXamgDQJh3fMHcpah-QW4edYzxmnzwXM" }}>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<TinderCards />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/tinder-shuffle/review" element={<ReviewSection />} />

          {/* Navbar-related pages */}
          <Route path="/services" element={<ProductsPage />} />
          <Route path="/learn" element={<LearnPage />} />
          <Route path="/safety" element={<SafetyPage />} />
          <Route path="/support" element={<ChatbaseIframe />} />

          {/* Maid-related routes */}
          <Route path="/maid-portal" element={<MaidPortal />} />
          <Route path="/maid-chat" element={<ChatPage />} />
          <Route path="/maid-schedule" element={<ProfilePage />} />
          <Route path="/maid-chat" element={<ChatPage />} />
        </Routes>
      </Router>
    </PayPalScriptProvider>
  );
}

export default App;
