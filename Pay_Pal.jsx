import React, { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import './Pay_Pal.css';
import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; // to know who paid

function PayPalButton() {
  const [showPayPal, setShowPayPal] = useState(false);

  const initialOptions = {
    "client-id": "AaWfHrfQT8-xfjy-UFHZmtNG2XkN1_OPeIapYMMazZGq16GRLXamgDQJh3fMHcpah-QW4edYzxmnzwXM",
    currency: "USD",
    intent: "capture",
  };

  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [{ amount: { value: "10.00" } }],
    });
  };

  const onApprove = (data, actions) => {
    return actions.order.capture().then(async (details) => {
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (!user) {
        console.error('No user logged in');
        return;
      }
  
      // Create a new transaction in Firestore
      try {
        await addDoc(collection(db, "transactions"), {
          customerId: user.uid,
          maidId: null, // TODO: replace dynamically if you know maid
          amount: details.purchase_units[0].amount.value,
          status: details.status || "Completed",
          date: serverTimestamp(),
          serviceDate: serverTimestamp(), // Optional: schedule actual cleaning date
          hoursBooked: 3, // Optional: fill real number
          paymentMethod: "PayPal",
          transactionId: data.orderID,
        });
  
        alert('Transaction completed by ' + details.payer.name.given_name);
      } catch (error) {
        console.error('Failed to record transaction:', error.message);
        alert('Payment succeeded but failed to record transaction.');
      }
    });
  };
  

  return (
    <div 
      className="paypal-wrapper"
      onMouseEnter={() => setShowPayPal(true)}
      onMouseLeave={() => setShowPayPal(false)}
    >
      <button className="paypal-open-button">💳 Subscribe</button>

      {showPayPal && (
        <div className="paypal-popup">
          <PayPalScriptProvider options={initialOptions}>
            <PayPalButtons
              style={{ layout: 'vertical', color: 'blue' }}
              createOrder={createOrder}
              onApprove={onApprove}
            />
          </PayPalScriptProvider>
        </div>
      )}
    </div>
  );
}

export default PayPalButton;
