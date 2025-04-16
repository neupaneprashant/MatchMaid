# 🧹 MatchMaid

**MatchMaid** is a modern web application that connects clients with domestic helpers ("maids") in a Tinder-style swiping interface. Users can create profiles, review availability, swipe through local maid profiles, and manage their own schedule and work preferences in a sleek, responsive interface.

## 🔥 Features

- 💁‍♀️ Swipeable card interface to browse maid profiles
- 🔐 Firebase-powered authentication with Email/Password and Google login
- 🌍 Multilingual landing page (English + Spanish toggle)
- 👤 Interactive profile panel for maids to update availability, pay, work range, and languages
- ✍️ Custom scheduling and service preferences (e.g., pets, kitchen, etc.)
- ⭐ Review system integration (coming soon)

## 🧰 Tech Stack

- **Frontend:** React.js, React Router, Framer Motion
- **Backend:** Firebase Auth + Firestore
- **Styling:** Custom CSS, Responsive UI
- **Icons:** React Icons
- **Animation:** Framer Motion (swipe effects)
- **Localization:** react-i18next

## 🚀 Live Demo

## 📂 Folder Structure

###################################################################################################################################

## 🛠️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/neupaneprashant/MatchMaid
   cd matchmaid
2. **npm install
3.Configure Firebase

  Create a Firebase project at firebase.google.com
  
  Enable Authentication (Email/Password + Google)
  
  Enable Firestore Database
  
  Replace placeholder in firebase.js with your Firebase config

  Sample firebase.js
// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_SENDER_ID',
  appId: 'YOUR_APP_ID',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

4. Run the app
    npm run dev
    # or
    npm start

#####################################################################################################

✅ How to Use
1. Visit the landing page (/)

2. Create an account or sign in using Google

3. Start swiping through available maid profiles

4. Click the profile icon (top-left) to open your editable profile

5. Set your schedule, work preferences, pay, and more

6. Logout or check your saved profile data in Firestore

###################################################################################################################################

🧪 To-Do / Future Improvements
 Maid review and rating system

 Search/filter maids by location or price

 Profile photo upload via Firebase Storage

 Notifications for booking requests

 Map view integration for range filtering  

 #####################################################################################################################
Hours Spreadsheet -- https://docs.google.com/spreadsheets/d/192Fyi-hntl_SO1HcgbuXpR2V1Ad12kVvCKc3PaTxvO4/edit?gid=0#gid=0
###################################################################################################################################
-- "If you find a bug, want to add a feature, or improve the code — feel free to contribute!"
