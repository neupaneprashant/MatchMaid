# 🔔 Notifications

This document explains how Firebase Cloud Messaging (FCM) is used.

## 📬 Purpose
- Notify maids when:
  - A booking is made
  - A task is completed
  - A review is submitted

## 📦 Firestore Token Storage

```json
notifications/{maidId} = {
  token: "FCM_TOKEN",
  updatedAt: Timestamp
}
```

## 📌 Implementation Notes
- Each maid device registers and updates its FCM token on login.
- Tokens are used with Firebase Admin SDK to send push notifications.