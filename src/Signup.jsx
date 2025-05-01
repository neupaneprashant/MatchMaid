import React, { useState, useEffect } from 'react';
import './signup.css';
import { auth } from './firebase';
import { useNavigate } from 'react-router-dom';
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from 'firebase/firestore';

function Signup({ defaultView = 'signup' }) {
  const [isSignup, setIsSignup] = useState(defaultView === 'signup');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  useEffect(() => {
    setIsSignup(defaultView === 'signup');
  }, [defaultView]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const saveUserToFirestore = async (user, role = 'maid') => {
    const db = getFirestore();
    const userRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(userRef);
    if (!docSnap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        name: user.displayName || 'New User',
        email: user.email,
        role,
        createdAt: serverTimestamp()
      });
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      await updateProfile(userCredential.user, { displayName: form.name });
      await saveUserToFirestore(userCredential.user); // 🔥
      navigate('/home');
    } catch (error) {
      alert(error.message);
    }
  };

  const handleSignin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, form.email, form.password);
      navigate('/home');
    } catch (error) {
      alert(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await saveUserToFirestore(result.user); // 🔥
      navigate('/home');
    } catch (error) {
      alert(`Google Sign-In Error: ${error.message}`);
    }
  };

  return (
    <div className="login-container">
      {!isSignup ? (
        <div className="login-form">
          <h1>Sign In</h1>
          <div className="social-icons">
            <a href="#" className="icon" onClick={handleGoogleSignIn}><i className='bx bxl-google'></i></a>
            <a href="#" className="icon"><i className='bx bxl-facebook'></i></a>
          </div>
          <div className="form-message-container">
            <span>Or use your email and password</span>
          </div>
          <form onSubmit={handleSignin}>
            <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
            <button type="submit">Sign In</button>
            <a href="#">Forgot Password?</a>
          </form>
          <p>Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); setIsSignup(true); }}>Sign Up</a></p>
        </div>
      ) : (
        <div className="signup-form">
          <h1>Create An Account</h1>
          <div className="social-icons">
            <a href="#" className="icon" onClick={handleGoogleSignIn}><i className='bx bxl-google'></i></a>
            <a href="#" className="icon"><i className='bx bxl-facebook'></i></a>
          </div>
          <div className="form-message-container">
            <span>Or use your email for registration</span>
          </div>
          <form onSubmit={handleSignup}>
            <input type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
            <button type="submit">Sign Up</button>
          </form>
          <p>Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); setIsSignup(false); }}>Sign In</a></p>
        </div>
      )}
    </div>
  );
}

export default Signup;
