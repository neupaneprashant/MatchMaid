// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import './HouseCleaning.css';

// export default function BathroomCleaning() {
//   const navigate = useNavigate();

//   return (
//     <div className="house-cleaning-page">
//       <div className="back-button-wrapper">
//         <button onClick={() => navigate('/')} className="back-home-button">
//           ⬅ Back to MatchMaid Home
//         </button>
//       </div>

//       <img
//         src="/bathroom-cleaning.png"
//         alt="Bathroom Cleaning"
//         className="service-banner"
//       />

//       <p>
//         MatchMaid’s bathroom cleaning services in Ruston are designed to bring sanitation, shine, and serenity to one of the most used spaces in your home. Our trained maids handle everything from tile scrubbing to sink polishing with meticulous attention to detail.
//       </p>

//       <div className="text-section">
//         <h2>Ruston’s Trusted Bathroom Cleaning Experts</h2>
//         <p>
//           We know the bathroom isn’t your favorite place to clean — so let us handle it for you! MatchMaid’s team disinfects toilets, tubs, faucets, and vanities using eco-friendly, child-safe cleaning agents. Our top priority is a sparkling, germ-free space you feel comfortable using every day.
//           <br /><br />
//           Whether it’s a shared family bathroom or a private en suite, we clean each space with respect, care, and precision.
//         </p>

//         <h3>Safe Products, Deep Cleaning, Flexible Booking</h3>
//         <p>
//           Our non-toxic cleaning solutions are safe for children and pets, and tough on grime. MatchMaid provides:
//           <ul>
//             <li>Toilet and tub sanitizing</li>
//             <li>Mirror and sink polishing</li>
//             <li>Tile and grout scrubbing</li>
//             <li>Floor mopping and odor elimination</li>
//           </ul>
//           <br />
//           Book online in minutes, reschedule up to 24 hours in advance with no extra fees, and enjoy peace of mind knowing your bathroom is fresh and clean.
//         </p>
//       </div>
//     </div>
//   );
// }
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function BathroomCleaning() {
  const navigate = useNavigate();

  // Inline styles
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
      width: '100%',
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

      <img
        src="/bathroom-cleaning.png" // Make sure this image exists in /public
        alt="Bathroom Cleaning"
        style={styles.image}
      />

      <p style={styles.paragraph}>
        MatchMaid’s bathroom cleaning services in Ruston are designed to bring sanitation, shine, and serenity to one of the most used spaces in your home. Our trained maids handle everything from tile scrubbing to sink polishing with meticulous attention to detail.
      </p>

      <h2 style={styles.heading2}>Ruston’s Trusted Bathroom Cleaning Experts</h2>
      <p style={styles.paragraph}>
        We know the bathroom isn’t your favorite place to clean — so let us handle it for you! MatchMaid’s team disinfects toilets, tubs, faucets, and vanities using eco-friendly, child-safe cleaning agents. Our top priority is a sparkling, germ-free space you feel comfortable using every day.
        <br /><br />
        Whether it’s a shared family bathroom or a private en suite, we clean each space with respect, care, and precision.
      </p>

      <h3 style={styles.heading3}>Safe Products, Deep Cleaning, Flexible Booking</h3>
      <p style={styles.paragraph}>
        Our non-toxic cleaning solutions are safe for children and pets, and tough on grime. MatchMaid provides:
      </p>

      <ul style={styles.list}>
        <li style={styles.listItem}>Toilet and tub sanitizing</li>
        <li style={styles.listItem}>Mirror and sink polishing</li>
        <li style={styles.listItem}>Tile and grout scrubbing</li>
        <li style={styles.listItem}>Floor mopping and odor elimination</li>
      </ul>

      <p style={styles.paragraph}>
        Book online in minutes, reschedule up to 24 hours in advance with no extra fees, and enjoy peace of mind knowing your bathroom is fresh and clean.
      </p>
    </div>
  );
}
