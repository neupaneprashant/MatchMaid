import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { getAuth, signOut } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import MaidDatePicker from './DatePicker';
import EarningsChart from './EarningsChart';
import { onAuthStateChanged } from 'firebase/auth';
import { format } from 'date-fns'; 
import './maidportal.css';

function MaidPortal() {
  const [transactions, setTransactions] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('dashboard'); // New state to switch HUD views
  const [earningsData, setEarningsData] = useState([]);
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const q = query(collection(db, "transactions"), where("maidId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const fetched = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        setTransactions(fetched);
  
        const earnings = fetched.reduce((sum, trans) => sum + parseFloat(trans.amount), 0);
        setTotalEarnings(earnings);
  
        // 🛠️ Build monthly earnings here
        const monthTotals = {};
  
        fetched.forEach((t) => {
          if (t.date) {
            const dateObj = t.date.toDate();
            const month = format(dateObj, 'MMM'); // like 'Jan', 'Feb'
            if (!monthTotals[month]) {
              monthTotals[month] = 0;
            }
            monthTotals[month] += parseFloat(t.amount);
          }
        });
  
        // Convert monthTotals object into array for the chart
        const monthlyData = Object.entries(monthTotals).map(([month, amount]) => ({
          month,
          amount,
        }));
  
        setEarningsData(monthlyData); // Store earningsData for chart
      } else {
        console.error('No authenticated user.');
      }
      setLoading(false);
    });
  
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const auth = getAuth();
    await signOut(auth);
    window.location.href = '/'; // Redirect after sign out
  };

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div className="maid-portal-container">
      <div className="sidebar">
        <h2 className="dashboard-title">Maid Dashboard</h2>
        <div className="sidebar-options">
          <button onClick={() => setView('dashboard')}>🏠 Overview</button>
          <button onClick={() => setView('chart')}>📈 Earnings Chart</button>
          <button onClick={() => setView('filter')}>✅ Filter Bookings</button>
          <button onClick={() => setView('rate')}>💵 Edit Hourly Rate</button>
          <button onClick={() => setView('calendar')}>📅 Manage Availability</button>
        </div>
        <button className="signout-button" onClick={handleSignOut}>🚪 Sign Out</button>
      </div>

      <div className="dashboard-content">
        {view === 'dashboard' && (
          <>
            <h1 className="welcome-text">Welcome!</h1>

            <h2 className="total-earnings">Total Earnings: ${totalEarnings.toFixed(2)}</h2>

            <div className="transactions-section">
              <h3>Past Bookings</h3>
              {transactions.length === 0 ? (
                <p>No bookings yet</p>
              ) : (
                <ul>
                  {transactions.map((t) => (
                    <li key={t.id}>
                      <strong>Amount:</strong> ${t.amount} — <strong>Status:</strong> {t.status}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
        {view === 'chart' && (
            <div>
            <EarningsChart earningsData={earningsData} />
            </div>
        )}

        {view === 'filter' && <h2>Filter Bookings (coming soon)</h2>}
        {view === 'rate' && <h2>Edit Hourly Rate (coming soon)</h2>}
        {view === 'calendar' && (
            <div>
                <h2>Manage Availability</h2>
                <MaidDatePicker />
            </div>
        )}

      </div>
    </div>
  );
}

export default MaidPortal;
