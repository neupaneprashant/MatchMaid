# 🛠️ MaidPortal Component

## 📌 Purpose
`MaidPortal` provides a **centralized dashboard** for maid users in the MatchMaid app to view **earnings**, **past bookings**, and navigate to other tools like **chat**, **calendar**, and **analytics**.

---

## 🔧 Key Features

| Feature                 | Description                                                 |
|-------------------------|-------------------------------------------------------------|
| 🏠 **Dashboard Overview**   | Displays welcome message, total earnings, and past bookings   |
| 📈 **Earnings Chart View**  | Visual representation of monthly income using `EarningsChart` |
| 💬 **Go to Chat**           | Redirects to maid chat interface                            |
| 📅 **Manage Availability**  | Button to navigate to a schedule creation page              |
| ✅ **Filter Bookings (WIP)**| Placeholder for future filtering functionality              |
| 🚪 **Sign Out**             | Securely signs out and redirects to the homepage            |

---

## 🧩 Component Logic

### 🗃️ State Variables

| State Variable    | Purpose                                         |
|-------------------|-------------------------------------------------|
| `transactions`    | Stores booking/payment history for the current maid |
| `totalEarnings`   | Sum of all completed transaction amounts         |
| `loading`         | Indicates if data is still being fetched         |
| `view`            | Controls the active section/tab in the dashboard |
| `earningsData`    | Monthly earnings, formatted for the chart component |

---

### 🔄 useEffect Logic
```js
useEffect(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // Fetch transactions where maidId == user.uid
      // Calculate totalEarnings and monthly chart data
    }
  });
}, []);
