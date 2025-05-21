# 🔐 Security Rules

This document outlines the Firebase Firestore security rules that govern how data is accessed within the MatchMaid application.

## 🔒 Key Access Rules

- **Customers** can read maid profiles, write bookings, and leave reviews.
- **Maids** can only read their own bookings and respond to reviews.
- **Admin** users (if implemented) may have extended access.

## 🧪 Sample Firestore Rule

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Public maid profiles
    match /users/{userId} {
      allow read: if resource.data.role == 'maid';
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    // Bookings
    match /transactions/{txnId} {
      allow create: if request.auth != null;
      allow read, update: if request.auth != null && (
        request.auth.uid == resource.data.customerId || 
        request.auth.uid == resource.data.maidId
      );
    }

    // Reviews
    match /reviews/{reviewId} {
      allow create: if request.auth != null;
      allow read: if true;
    }

  }
}
```

## 📌 Notes
- Always test security rules using the Firebase Emulator.
- Consider rate limiting or Firestore quotas for protection.