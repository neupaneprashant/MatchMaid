# 👥 User Roles & Authentication

This document describes the two user roles and how authentication is handled.

## 🧍 Customer Role
- Can swipe through maids
- Book, complete tasks
- Leave reviews

## 🧼 Maid Role
- View and manage bookings
- Respond to reviews
- Track ratings and earnings

## 🔐 Authentication Flow
- Firebase Authentication handles email/password and social logins
- Role is saved in Firestore under `users/{uid}`

## 📌 Redirect Paths
| Role      | Redirect To      |
|-----------|------------------|
| Customer  | `/home`          |
| Maid      | `/maid-portal`   |

## 📦 Auth Providers
- Email/Password
- Google
- Facebook