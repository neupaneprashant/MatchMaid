import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function HouseCleaning() {
  const navigate = useNavigate();

  const styles = {
    wrapper: {
      backgroundColor: '#111',
      color: '#fff',
      padding: '2rem',
      fontFamily: 'Arial, sans-serif',
      lineHeight: '1.6',
    },
    backButtonWrapper: {
      marginBottom: '1rem',
      textAlign: 'center',
    },
    backButton: {
      backgroundColor: '#222',
      color: '#fff',
      border: 'none',
      padding: '0.5rem 1rem',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '1rem',
    },
    imageWrapper: {
      textAlign: 'center',
    },
    image: {
      width: '80%',
      maxHeight: '500px',
      objectFit: 'cover',
      borderRadius: '8px',
      marginBottom: '1.5rem',
      display: 'block',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    paragraph: {
      marginBottom: '1.2rem',
      color: '#ddd',
    },
    heading2: {
      fontSize: '1.5rem',
      marginTop: '1rem',
      marginBottom: '0.5rem',
      color: '#fff',
    },
    heading3: {
      fontSize: '1.2rem',
      marginTop: '1.5rem',
      marginBottom: '0.5rem',
      color: '#fff',
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.backButtonWrapper}>
        <button onClick={() => navigate('/')} style={styles.backButton}>
          ⬅ Back to MatchMaid Home
        </button>
      </div>

      <div style={styles.imageWrapper}>
        <img
          src="/house-cleaning.jpg"
          alt="House Cleaning"
          style={styles.image}
        />
      </div>

      <p style={styles.paragraph}>
        MatchMaid delivers exceptional results through our highly trained house cleaners proudly serving Ruston and surrounding communities. Our affordable services are designed to meet the needs of residents across Lincoln Parish, ensuring every home shines with comfort and care.
      </p>

      <h2 style={styles.heading2}>Home Cleaners in Ruston</h2>
      <p style={styles.paragraph}>
        When you choose MatchMaid, you’re choosing more than just a cleaning service — you’re choosing dependable, professional care that goes above and beyond expectations. Our dedicated Ruston-based maids work hard to ensure every corner of your home is cleaned with precision, so you can relax and enjoy a spotless space without lifting a finger. Your complete satisfaction is always our top priority.
        <br /><br />
        As a trusted name in the community, MatchMaid has earned a reputation for reliable, consistent service and friendly customer care. Whether it’s a one-time deep clean or routine upkeep, our cleaners take pride in delivering high-quality results that leave your home feeling fresh, organized, and inviting.
        <br /><br />
        Each of our maids is professionally trained to disinfect surfaces, change linens, tidy personal spaces, and sanitize bathrooms, kitchens, and living areas. When you walk back through your door, you’ll step into a clean, calm environment — just the way it should be.
      </p>

      <h3 style={styles.heading3}>Top-Quality House Cleaning in Ruston</h3>
      <p style={styles.paragraph}>
        Whether you live in a cozy one-story home or a spacious three-story residence, MatchMaid offers professional cleaning services tailored to your space — all at competitive, transparent pricing. We’re confident you’ll be impressed by the value you receive through our detailed multi-point cleaning checklist, designed to leave every room spotless.
        <br /><br />
        We know plans can change. That’s why MatchMaid offers flexible rescheduling at no extra cost — just let us know at least 24 hours in advance, and we’ll gladly adjust your appointment to fit your needs.
        <br /><br />
        Booking is simple and fast — just visit our website to schedule your customized cleaning in minutes. Prefer a personal touch? Our friendly Ruston-based support team is always ready to assist you.
      </p>

      <p style={styles.paragraph}>
        You can instantly arrange for our friendly maids to provide you with a customized house cleaning service...
      </p>
    </div>
  );
}
