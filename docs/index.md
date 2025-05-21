# 🧹 MatchMaid Documentation

Welcome to the official documentation for **MatchMaid**, a Tinder-style maid hiring application built with React and Firebase. This site provides setup instructions, component guides, and architectural references for developers and collaborators.

---

## 📁 Contents

### 🔧 Project Setup & Architecture
- [Overview](overview.md)  
  Summary of features, tech stack, Firebase configuration, and app flow.
- [Setup Instructions](setup.md)  
  Installation, Firebase setup, and local development.
- [Database Schema](database-schema.md)  
  Firestore collections for users, profiles, reviews, and transactions.

### 👥 User Roles & Routing
- [User Roles](roles.md)  
  Capabilities of maids vs. hirees.
- [Routes Overview](routes.md)  
  All frontend paths and access controls.

### 🔐 Authentication & Landing
- [SignUp Component](signup.md)  
  Firebase Auth, role-based routing, and social login.
- [Landing Page](landing-page.md)  
  Homepage layout, language toggle, service dropdown, and login modal.

### 📅 Scheduling & Charts
- [Maid Date Picker](date-picker.md)  
  Component for selecting availability or service dates.
- [Earnings Chart](earnings-chart.md)  
  Line chart visualization of monthly earnings.

### 💳 Payments & Reviews
- [PayPalButton](paypalbutton.md)  
  PayPal integration, Firestore logging, and secure checkout.
- [MyReviews Component](myreviews.md)  
  View, edit, and delete reviews submitted by users.

### 🧼 Maid Features
- [Maid Portal](maidportal.md)  
  Dashboard for bookings, earnings, availability, and chat.
- [Maid Rating Analytics](maidratinganalytics.md)  
  Average rating and star breakdown with visual UI.

---

## 🚀 Getting Started

Start with:
1. [Setup Instructions](setup.md)
2. [Overview](overview.md)
3. [User Roles](roles.md)

Use the rest of the docs as needed during development or onboarding.

---

> 🧠 Tip: All `.md` files are located in the `/docs` folder and rendered automatically on GitHub Pages.