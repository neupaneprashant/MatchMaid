// utils/storage.js

export const saveUser = (user) => {
    localStorage.setItem('user', JSON.stringify(user));
  };
  
  export const getUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  };
  
  export const clearUser = () => {
    localStorage.removeItem('user');
  };

  
  import { saveUser } from './utils/storage'; // Adjust path as needed

  const handleSubmit = (e) => {
    e.preventDefault();
  
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
  
    saveUser(formData); // 🔥 Save to localStorage
    console.log("User signed up:", formData);
  };
  