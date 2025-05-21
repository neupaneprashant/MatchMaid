# 🔑 Firebase Configuration

This document outlines how Firebase services are initialized and configured in the MatchMaid app.

## 🔧 Required Services
- Authentication
- Firestore
- Cloud Storage
- Cloud Messaging

## 📁 Example: `firebase.js`

```js
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "your-key",
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "your-id",
  appId: "your-app-id"
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
```

## 🔐 Secrets
All sensitive keys must be stored in a `.env` file and never committed to Git.