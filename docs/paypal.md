# 💳 PayPalButton Component Documentation

## 📌 Purpose
The `PayPalButton` component allows users to **subscribe** or **make payments via PayPal** within the MatchMaid app. It integrates PayPal’s secure checkout system and **logs each successful transaction** in Firebase Firestore.

---

## 🔧 Key Features

| Feature               | Description                                                                 |
|------------------------|-----------------------------------------------------------------------------|
| 🧾 **PayPal Buttons**       | Secure payment interface using PayPal Checkout                         |
| 🔐 **Auth Integration**     | Associates payments with the currently authenticated Firebase user     |
| 🧠 **Firestore Logging**    | Saves each transaction in the `transactions` collection                |
| 🪄 **UI Popup**             | PayPal buttons appear only on hover to maintain a clean interface       |

---

## 🧩 Component Logic

### 🔄 useState

```js
const [showPayPal, setShowPayPal] = useState(false);
