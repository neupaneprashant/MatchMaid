# 🔐 Signup Component Documentation

## 📌 Purpose
This component handles **user registration**, **login**, and **social authentication** (Google, Facebook) for the MatchMaid app. It supports **role-based routing**, distinguishing between **maid** and **customer** users.

---

## ✨ Key Features

| Feature             | Description                                                                 |
|---------------------|-----------------------------------------------------------------------------|
| 📝 **Sign Up Form**     | Email/password-based account creation with role selection                  |
| 🔐 **Sign In Form**     | Email/password login using Firebase Authentication                        |
| 🌍 **Social Sign-In**   | Google and Facebook login via `signInWithPopup()`                          |
| 🧭 **Role-based Routing** | Redirects maids to `/maid-portal`, customers to `/home`                  |
| 📧 **Forgot Password**  | Sends Firebase password reset email                                       |
| 🌀 **Loading Spinner**   | Displays visual loading state during async operations                    |

---

## 🧩 Props

| Prop          | Type     | Required | Description                                            |
|---------------|----------|----------|--------------------------------------------------------|
| `defaultView` | `string` | No       | `'signup'` or `'login'` to set the initial component view |

---

## 🔐 Authentication Methods

| Method             | Firebase API Used                               |
|--------------------|--------------------------------------------------|
| Email Sign Up      | `createUserWithEmailAndPassword`                |
| Email Sign In      | `signInWithEmailAndPassword`                    |
| Google Sign In     | `signInWithPopup(GoogleAuthProvider)`           |
| Facebook Sign In   | `signInWithPopup(FacebookAuthProvider)`         |
| Forgot Password    | `sendPasswordResetEmail`                        |

---

## 🔍 Firestore Integration

On new user sign-up, the following structure is saved to Firestore:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "role": "maid" | "customer",
  "createdAt": "Timestamp"
}
```

- **Collection**: `users`  
- **Document ID**: `user.uid`

---

## 🧠 Component State

| State       | Purpose                                          |
|-------------|--------------------------------------------------|
| `isSignup`  | Boolean to toggle between Sign Up and Sign In    |
| `form`      | Object storing form data: name, email, password, role |
| `loading`   | Boolean for displaying loading spinner            |

---

## 🚦 Navigation

| Role      | Redirect Path  |
|-----------|----------------|
| `maid`    | `/maid-portal` |
| `customer`| `/home`        |

---

## 📦 Dependencies

- **Firebase Authentication & Firestore**  
  - `auth`, `db`, `createUserWithEmailAndPassword`,  
    `signInWithEmailAndPassword`, `signInWithPopup`,  
    `updateProfile`, `sendPasswordResetEmail`,  
    `setDoc`, `doc`, `getDoc`

- **React Router**: `useNavigate`  
- **CSS**: `signup.css`  
- **Icons**: Boxicons (`bx bxl-google`, `bx bxl-facebook`)

---

## 🖼 UI Sections

### ✅ Sign Up Form
- Fields: Name, Email, Password  
- Role switch: 🧹 **Customer** | 🧼 **Maid**  
- Social Sign-Up: Google, Facebook

### ✅ Sign In Form
- Fields: Email, Password  
- Forgot Password link  
- Social Sign-In buttons

### 🔁 Role-Based Routing
- Redirects based on selected role after successful login or signup.

---

## 💡 Usage Example

```jsx
<Modal show={showModal} onClose={() => setShowModal(false)}>
  <Signup defaultView="signup" />
</Modal>
```

---

## 📌 Notes

- Make sure to **configure OAuth credentials** for Google and Facebook in your Firebase console.
- Roles (`maid` vs `customer`) determine access control and navigation throughout the app.

---

## 🔗 Firebase Auth Setup Guides

- **Facebook Login**:  
  https://firebase.google.com/docs/auth/web/facebook-login

- **Google Sign-In**:  
  https://firebase.google.com/docs/auth