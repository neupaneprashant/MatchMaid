
import { useNavigate } from 'react-router-dom';

export default function KitchenCleaning() {
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
          src="/kitchen-cleaning.png" // Recommended: Rename the image to a URL-safe filename
          alt="Kitchen Cleaning"
          style={styles.image}
        />
      </div>

      <p style={styles.paragraph}>
        A clean kitchen is the heart of a healthy home. MatchMaid offers detailed kitchen cleaning services in Ruston, tackling grease, grime, and clutter with expert care and food-safe solutions.
      </p>

      <h2 style={styles.heading2}>Ruston Kitchen Cleaning Experts</h2>
      <p style={styles.paragraph}>
        Whether you cook daily or occasionally, grease and spills are inevitable. Our maids focus on counters, cabinets, stoves, and sinks — restoring order and cleanliness to your cooking space.
        <br /><br />
        We understand the importance of sanitizing food prep areas without harsh chemicals. That’s why we use eco-friendly, kitchen-safe products.
        <br /><br />
        Say goodbye to hidden crumbs and hello to a sparkling kitchen!
      </p>

      <h3 style={styles.heading3}>Flexible, Thorough & Affordable</h3>
      <p style={styles.paragraph}>
        Schedule regular cleanings or request a deep clean before guests arrive. With MatchMaid, your kitchen is always guest-ready and family-safe.
        <br /><br />
        Book now to give your kitchen the shine it deserves!
      </p>
    </div>
  );
}
