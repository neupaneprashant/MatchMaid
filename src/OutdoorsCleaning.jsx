import { AlignCenter } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function OutdoorsCleaning() {
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
    image: {
      width: '80%',
      maxHeight: '500px',
      objectFit: 'cover',
      borderRadius: '8px',
      marginBottom: '1.5rem',

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
    },
    list: {
      listStyleType: 'disc',
      paddingLeft: '1.5rem',
      color: '#ddd',
      marginBottom: '1.2rem',
    },
    listItem: {
      marginBottom: '0.5rem',
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.backButtonWrapper}>
        <button onClick={() => navigate('/')} style={styles.backButton}>
          ⬅ Back to MatchMaid Home
        </button>
      </div>
      <div style={{ textAlign: 'center' }}>
          <img
            src="/driveway-cleaning.png"
            alt="Outdoor Cleaning"
            style={styles.image}
          />
        </div>


      <p style={styles.paragraph}>
        MatchMaid offers top-notch outdoor cleaning services in Ruston and surrounding areas, helping your home look just as clean and polished on the outside as it does on the inside. From driveways and sidewalks to patios and decks, our expert maids are ready to tackle grime, stains, and buildup with care and precision.
      </p>

      <h2 style={styles.heading2}>Ruston's Trusted Outdoor Cleaning Professionals</h2>
      <p style={styles.paragraph}>
        Outdoor spaces are often the first impression of your home — and at MatchMaid, we make sure it's a great one. Our cleaning pros use high-quality equipment and eco-safe solutions to remove debris, dirt, mold, and more from your exterior surfaces. Whether you need seasonal maintenance or a pre-event spruce-up, we’ve got you covered.
        <br /><br />
        We’re committed to protecting your property’s appearance and longevity through professional care and detail-oriented cleaning. That’s why residents throughout Lincoln Parish trust MatchMaid to keep their homes looking sharp — from the curb to the back fence.
      </p>

      <h3 style={styles.heading3}>Comprehensive Outdoor Cleaning Services</h3>
      <p style={styles.paragraph}>
        Our team handles a range of outdoor tasks including:
      </p>

      <ul style={styles.list}>
        <li style={styles.listItem}>Driveway and sidewalk power washing</li>
        <li style={styles.listItem}>Patio and deck scrubbing</li>
        <li style={styles.listItem}>Garage door cleaning</li>
        <li style={styles.listItem}>Outdoor furniture and surface sanitization</li>
      </ul>

      <p style={styles.paragraph}>
        Book with confidence knowing MatchMaid offers flexible scheduling and simple rescheduling up to 24 hours before your appointment — no extra fees.
        <br /><br />
        Schedule your next outdoor cleaning today through our fast online portal or reach out to our local support team for help with a custom request.
      </p>
    </div>
  );
}
