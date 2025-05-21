# 🧹 MatchMaid: Tinder-style Maid Hiring App

**MatchMaid** is a web application where users can **browse**, **swipe**, **hire**, and **review** maids using a Tinder-style interface. It supports separate views and flows for **customers** and **maids**, powered by **React**, **Firebase** (Auth, Firestore, Storage, Cloud Messaging), and modern UI libraries.

---

## 📁 Table of Contents
- [💻 Tech Stack](#-tech-stack)
- [🔧 Project Setup](setup.md)
- [🔑 Firebase Configuration](setup.md)
- [👥 User Roles & Authentication](roles.md)
- [🔄 Main App Flow](overview.md)
- [🧩 Component Overview](#-component-overview)
  - [Routes Overview](routes.md)
  - [Signup Component](signup.md)
  - [Landing Page](landing-page.md)
  - [Maid Portal](maidportal.md)
  - [Maid Rating Analytics](maidratinganalytics.md)
  - [MyReviews Component](my-reviews.md)
  - [PayPalButton](paypalbutton.md)
  - [Maid Date Picker](date-picker.md)
  - [Earnings Chart](earnings-chart.md)
- [🗂️ Firestore Structure](database-schema.md)
- [🔐 Security Rules](#security-rules)
- [🔔 Notifications](#notifications)
- [🚀 Future Improvements](#future-improvements)

---

## 💻 Tech Stack
- **React** + **Tailwind CSS**
- **Firebase Authentication**
- **Firestore** (Realtime Database)
- **Firebase Cloud Storage**
- **Firebase Cloud Messaging**
- **Vite** + **Node.js**
- **Lucide Icons**, **Framer Motion**

---

## 🔧 Project Setup

```bash
git clone https://github.com/neupaneprashant/MatchMaid.git
cd MatchMaid
npm install
npm run dev
```