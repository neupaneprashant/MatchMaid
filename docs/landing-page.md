# 🧭 LandingPage Component

## 📌 Purpose
Homepage and entry point for users visiting MatchMaid.

## 🧱 Features

- 🧼 Branded nav bar with logo
- 🗂 Dropdown for services
- 🌐 Language toggle using react-i18next
- 🔐 Login/Signup modal
- ⭐ Shortcut to reviews for testing

## 🧩 Structure

### 📦 Imports
- `react`, `useState`, `react-router-dom`, `react-i18next`
- `Modal`, `Signup`
- `landing.css`

### 🧑‍💻 State

| State         | Type     | Description                          |
|---------------|----------|--------------------------------------|
| showModal     | boolean  | Controls modal visibility            |
| isSignupView  | boolean  | Determines login/signup view         |

### 🚀 Functions

- `toggleLanguage()` — switch between 'en' and 'es'
- `openModal(view)` — opens modal for login or signup

### 🧭 Navigation Links

| Label      | Route                         |
|------------|-------------------------------|
| Learn      | /learn                        |
| Safety     | /safety                       |
| Support    | /support                      |
| Reviews ⭐ | /tinder-shuffle/review        |

## 📦 Modal Usage

```jsx
<Modal show={showModal} onClose={() => setShowModal(false)}>
  <Signup defaultView={isSignupView ? 'signup' : 'login'} />
</Modal>
```

## 🌐 i18n
All UI text is internationalized with `t('key')` from `useTranslation()`.

## 🖼 UI
- Navbar + hero
- "Swipe Right™" headline
- CTA: "Create Account"