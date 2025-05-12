import React, { useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import './landing.css';
import Modal from './Modal';
import Signup from './Signup'; // Contains both Login & Signup UI

export default function LandingPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [showModal, setShowModal] = useState(false);
  const [isSignupView, setIsSignupView] = useState(false); // true = signup, false = login

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'es' : 'en');
  };

  const openModal = (view = 'login') => {
    setIsSignupView(view === 'signup');
    setShowModal(true);
  };

  return (
    <>
      <div className="landing-wrapper">
        <nav className="navbar">
          <div className="logo" onClick={() => navigate('/')}>
            <img src="/MATCHMAID.png" alt="MatchMaid Logo" className="logo-img" />
          </div>

          <ul className="nav-links">
            {/* Dropdown for Services */}
            <li className="dropdown">
              <span className="menu-title">{t('Services')}</span>
              <div className="dropdown-content">
                <div onClick={() => navigate('/services/house')}>House Cleaning</div>
                <div onClick={() => navigate('/services/Pets')}>Pets Cleaning</div>
                <div onClick={() => navigate('/services/Kitchen')}>Kitchen Cleaning</div>
                <div onClick={() => navigate('/services/Outdoors')}>Outdoor Cleaning</div>
                <div onClick={() => navigate('/services/Bathroom')}>Bathroom Cleaning</div>
                </div>
            </li>

            <li style={{ cursor: 'pointer' }} onClick={() => navigate('/learn')}>
              {t('Learn')}
            </li>
            <li style={{ cursor: 'pointer' }} onClick={() => navigate('/safety')}>
              {t('Safety')}
            </li>
            <li style={{ cursor: 'pointer' }} onClick={() => navigate('/support')}>
              {t('Support')}
            </li>
            <li style={{ cursor: 'pointer' }} onClick={() => navigate('/tinder-shuffle/review', { state: { maidId: 'maid123' } })}>
              ⭐ Reviews
            </li>
          </ul>

          <div className="nav-actions">
            <button className="language-btn" onClick={toggleLanguage}>
              🌐 {t('language')}
            </button>
            <button className="login-btn" onClick={() => openModal('login')}>
              {t('login')}
            </button>
          </div>
        </nav>

        <div className="hero">
          <div className="hero-content">
            <h1>
              <Trans i18nKey="headline">
                Swipe <span className="highlight">Right</span><sup>™</sup>
              </Trans>
            </h1>
            <button className="cta-button" onClick={() => openModal('signup')}>
              {t('create_account')}
            </button>
          </div>
        </div>
      </div>

      {/* Modal with dynamic content */}
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <Signup defaultView={isSignupView ? 'signup' : 'login'} />
      </Modal>
    </>
  );
}

