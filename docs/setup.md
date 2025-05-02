# Setup Instructions

## Prerequisites
- Node.js + npm
- Firebase project
- PayPal developer account (optional)

## Installation
```bash
npm install
```

## Firebase Setup
```js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: '...',
  authDomain: '...',
  projectId: '...',
  ...
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

## Running Locally
```bash
npm run dev
```