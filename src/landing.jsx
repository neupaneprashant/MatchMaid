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
            <li>{t('products')}</li>
            <li>{t('learn')}</li>
            <li>{t('safety')}</li>
            <li>{t('support')}</li>
            <li>{t('download')}</li>
            <li>{t('gift_cards')}</li>
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
