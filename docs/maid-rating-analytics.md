# 📊 MaidRatingAnalytics Component

## 📌 Purpose
`MaidRatingAnalytics` displays **average rating**, **total number of reviews**, and a **visual star-wise breakdown** of a maid's ratings. It helps maids understand how they're performing based on customer feedback.

---

## 🧾 Props

| Prop      | Type   | Required | Description                                                |
|-----------|--------|----------|------------------------------------------------------------|
| `maidId`  | String | ✅ Yes    | The Firestore UID of the maid whose reviews are analyzed.  |

---

## ⚙️ How It Works

### 🔍 Data Fetching
- On mount or whenever `maidId` changes, it queries the `reviews` collection in Firestore for all reviews with a matching `maidId`.

### 🧮 Calculation
- Computes the **average rating**.
- Counts how many reviews were rated:
  - ★ 5
  - ★ 4
  - ★ 3
  - ★ 2
  - ★ 1

### 🖥️ UI Display
- Shows the **average rating numerically**.
- Displays a **progress bar** for each star level (1 to 5).
- Lists the **total number of reviews**.
- Shows a **spinner** while loading.

---

## 🔥 Firestore Collection Used

**Collection**: `reviews`

Each document is expected to contain:
```json
{
  "maidId": "maid456",
  "rating": 5
}
