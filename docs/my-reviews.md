# 📝 MyReviews Component Documentation

## 📌 Purpose
The `MyReviews` component displays all the reviews written by the currently signed-in user. It allows users to **edit** or **delete** their past reviews and provides an intuitive interface with a star-based rating system.

---

## 🔧 How It Works

### 🔐 Authentication Listener
- Uses `onAuthStateChanged` to detect when a user signs in or out.
- If signed in, their `uid` is used to query reviews they authored.

### 🔍 Fetching Reviews
- Queries the `reviews` collection in Firestore for documents where `userId == currentUser.uid`.
- Stores results in the `myReviews` state.

### ✏️ Editing Reviews
- Users can edit both **text** and **rating**.
- Stars are clickable and color-coded based on selection.
- On "Save", the review is updated in Firestore.

### 🗑️ Deleting Reviews
- Prompts the user for confirmation.
- If confirmed, the review is deleted from Firestore and removed from the state.

---

## 🗂️ Firestore Structure

**Collection**: `reviews`

Each document should include the following structure:

```json
{
  "userId": "user123",
  "maidId": "maid456",
  "text": "Great service!",
  "rating": 5
}
