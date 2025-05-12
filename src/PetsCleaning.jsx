import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function PetsCleaning() {
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
      marginRight: 'auto'
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
          src="/Pet.png"
          alt="Pet Cleaning"
          style={styles.image}
        />
      </div>

      <p style={styles.paragraph}>
        MatchMaid understands that your furry friends are part of the family, and we offer pet-specific cleaning services designed to keep your home fresh, allergen-free, and hair-free. Serving Ruston and nearby communities, we ensure your living spaces stay clean and comfortable — even with pets around.
      </p>

      <h2 style={styles.heading2}>Pet-Friendly Cleaning in Ruston</h2>
      <p style={styles.paragraph}>
        Our pet cleaning specialists are trained to handle fur, dander, odors, and accidental messes with care and professionalism. We pay attention to couches, carpets, and pet-frequented areas to ensure no trace is left behind.
        <br /><br />
        We only use non-toxic, pet-safe cleaning products — so you can rest easy knowing your home is both spotless and safe for your companions.
        <br /><br />
        Whether it's a post-bath mess or daily shedding, our maids will handle it all with love and efficiency.
      </p>

      <h3 style={styles.heading3}>Ruston's Trusted Pet Cleaning Pros</h3>
      <p style={styles.paragraph}>
        Our flexible scheduling means you can book a deep pet clean whenever it’s convenient. MatchMaid is committed to making sure your home stays clean and inviting — even with pets in the house.
        <br /><br />
        Book online or contact our friendly Ruston team today to schedule your pet-focused cleaning service!
      </p>
    </div>
  );
}
