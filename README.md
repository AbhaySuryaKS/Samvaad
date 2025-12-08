# Samvaad – Real-Time Chat Application

Samvaad is a real-time one-to-one chat application built using **React, Firebase, and Cloudinary**. It supports authentication, real-time messaging, media sharing, and user profile viewing with a responsive UI.

---

## 🚀 Features

- Firebase Authentication  
- Real-time Firestore messaging  
- Image, Video & File sharing via Cloudinary  
- User search & chat initiation  
- Chat profile viewer  
- Auto-scroll to latest message  
- Message timestamps  
- Responsive UI with Tailwind CSS  
- Toast notifications for errors  

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React (Vite) |
| Styling | Tailwind CSS |
| Authentication | Firebase Auth |
| Database | Firebase Firestore |
| Media Storage | Cloudinary |
| Routing | React Router |
| Notifications | React Toastify |

---

## 📁 Project Structure

```
## 📄 Core File Responsibilities

### `main.jsx`
Application entry point and ReactDOM rendering.

### `App.jsx`
Handles routing between Auth, Chat, and Profile pages.

### `authPage.jsx`
Manages user login and registration using Firebase Authentication.

### `chatPage.jsx`
Controls chat layout, selected chat state, and message rendering.

### `profilePage.jsx`
Displays user profile details and allows editing.

### `chatList.jsx`
- Streams user chats in real time  
- Searches users  
- Creates new chat threads  
- Displays recent conversations  

### `chatbox.jsx`
- Displays messages  
- Sends text & media messages  
- Subscribes to live messages  
- Handles file uploads  
- Auto-scrolls to latest message  
- Opens chatter profile  

### `chatterProfile.jsx`
Displays selected chat user’s profile.

### `mediaDisplay.jsx`
Renders images, videos, and downloadable files in chat.

### `navBar.jsx`
Top navigation bar with user avatar and page switching.

### `firebase.js`
Firebase configuration, authentication, and Firestore operations.

### `firebaseError.js`
Maps Firebase error codes to readable messages.

### `cloudinary.js`
Uploads media files to Cloudinary and returns secure URLs.

---

## 🔐 Environment Variables

Create a `.env` file in the root:

```

VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

VITE_CLOUDINARY_CLOUD_NAME=your_cloud
VITE_CLOUDINARY_UPLOAD_PRESET=your_preset

````

---

## ▶️ Run Locally

```bash
npm install
npm run dev
````

Open in browser:

```
http://localhost:5173
```

---

## ⚠️ Current Limitations

* No debounce on user search
* No duplicate chat prevention
* No message length limit
* No media size restriction
* No online status tracking
* No group chats

---

## ✅ Future Enhancements

* Group chats
* Typing indicator
* Read receipts
* Voice messages
* Push notifications

---

## 👨‍💻 Developer

**Abhay Surya K S**


---

## 🧠 Deployment Warning

This project is **not production hardened yet**.
Add security rules, validation, and rate limiting before public deployment.

```
