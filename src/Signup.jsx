import React, { useState, useEffect } from 'react';
import './signup.css';
import { auth, db } from './firebase';
import { useNavigate } from 'react-router-dom';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';

function Signup({ defaultView = 'signup' }) {
  const [isSignup, setIsSignup] = useState(defaultView === 'signup');
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'customer' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsSignup(defaultView === 'signup');
  }, [defaultView]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      await updateProfile(userCredential.user, { displayName: form.name });
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        uid: userCredential.user.uid,  // ✅ store UID explicitly
        name: form.name,
        email: form.email,
        role: form.role,
        createdAt: new Date(),
      });

      if (form.role === 'maid') {
        navigate('/maid-portal');
      } else {
        navigate('/home');
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, form.email, form.password);
      const user = userCredential.user;
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.data();

      if (userData?.role === 'maid') {
        navigate('/maid-portal');
      } else {
        navigate('/home');
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        await setDoc(userDocRef, {
          name: user.displayName || '',
          email: user.email,
          role: 'customer',
          createdAt: new Date(),
        });
      }

      const userData = (await getDoc(userDocRef)).data();
      if (userData.role === 'maid') {
        navigate('/maid-portal');
      } else {
        navigate('/home');
      }
    } catch (error) {
      console.error('Google Sign-In Error:', error.message);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookSignIn = async () => {
    const provider = new FacebookAuthProvider();
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        await setDoc(userDocRef, {
          name: user.displayName || '',
          email: user.email,
          role: 'customer',
          createdAt: new Date(),
        });
      }

      const userData = (await getDoc(userDocRef)).data();
      if (userData.role === 'maid') {
        navigate('/maid-portal');
      } else {
        navigate('/home');
      }
    } catch (error) {
      console.error('Facebook Sign-In Error:', error.message);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!form.email) {
      alert("Please enter your email to reset your password.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, form.email);
      alert("Password reset email sent! Please check your inbox.");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="login-container">
      {loading && (
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      )}

      {!isSignup ? (
        <div className="login-form">
          <h1>Sign In</h1>
          <div className="social-icons">
            <a href="#" className="icon" onClick={handleGoogleSignIn}>
              <i className="bx bxl-google"></i>
            </a>
            <a href="#" className="icon" onClick={handleFacebookSignIn}>
              <i className="bx bxl-facebook"></i>
            </a>
          </div>
          <div className="form-message-container">
            <span>Or use your email and password</span>
          </div>
          <form onSubmit={handleSignin}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <p className="forgot-password">
              <a href="#" onClick={(e) => { e.preventDefault(); handleForgotPassword(); }}>
                Forgot Password?
              </a>
            </p>
            <button type="submit">Sign In</button>
          </form>
          <p>
            Don't have an account?{' '}
            <a href="#" onClick={(e) => { e.preventDefault(); setIsSignup(true); }}>
              Sign Up
            </a>
          </p>
        </div>
      ) : (
        <div className="signup-form">
          <h1>Create An Account</h1>
          <div className="social-icons">
            <a href="#" className="icon" onClick={handleGoogleSignIn}>
              <i className="bx bxl-google"></i>
            </a>
            <a href="#" className="icon" onClick={handleFacebookSignIn}>
              <i className="bx bxl-facebook"></i>
            </a>
          </div>
          <div className="form-message-container">
            <span>Or use your email for registration</span>
          </div>
          <form onSubmit={handleSignup}>
            <div className="role-switch">
              <button
                type="button"
                className={`role-button ${form.role === 'customer' ? 'active' : ''}`}
                onClick={() => setForm({ ...form, role: 'customer' })}
              >
                🧹 Customer
              </button>
              <button
                type="button"
                className={`role-button ${form.role === 'maid' ? 'active' : ''}`}
                onClick={() => setForm({ ...form, role: 'maid' })}
              >
                🧼 Maid
              </button>
            </div>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <button type="submit">Sign Up</button>
          </form>
          <p>
            Already have an account?{' '}
            <a href="#" onClick={(e) => { e.preventDefault(); setIsSignup(false); }}>
              Sign In
            </a>
          </p>
        </div>
      )}
    </div>
  );
}

export default Signup;
