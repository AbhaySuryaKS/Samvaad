# Samvaad 💬

A modern, real-time chat application built with React, Firebase, and Tailwind CSS. Samvaad enables users to connect and communicate seamlessly with a beautiful, responsive interface.

![Samvaad Logo](./public/AppLogo.jpg)

## ✨ Features

- **Real-time Messaging**: Instant message delivery using Firebase Firestore
- **User Authentication**: Secure login with email/password and Google OAuth
- **Media Sharing**: Share images, videos, and files with other users
- **User Profiles**: Customizable profiles with avatars and bios
- **Search Functionality**: Find and connect with users by username
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Beautiful dark-themed interface with smooth animations

## 🚀 Tech Stack

- **Frontend**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **Media Storage**: Cloudinary
- **Routing**: React Router v6
- **Notifications**: React Toastify

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm or yarn
- A Firebase account
- A Cloudinary account

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://AbhaySuryaKS/samvaad.git
   cd samvaad
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory and add your Firebase configuration:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
   ```

4. **Configure Firebase**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Email/Password and Google authentication
   - Create a Firestore database
   - Set up the following collections: `users`, `userChats`, `messages`

5. **Configure Cloudinary**
   - Create an account at [Cloudinary](https://cloudinary.com/)
   - Create an unsigned upload preset in your settings
   - Add your cloud name and upload preset to the `.env` file

## 🎯 Usage

1. **Start the development server**
   ```bash
   npm run dev
   ```

2. **Build for production**
   ```bash
   npm run build
   ```

3. **Preview production build**
   ```bash
   npm run preview
   ```
   
## 🔑 Key Features Explained

### Authentication
- Email/Password registration and login
- Google OAuth integration
- Password reset functionality
- Protected routes for authenticated users

### Real-time Chat
- Instant message delivery
- Message read/unread status
- Last message preview in chat list
- Automatic message sorting by timestamp

### Media Sharing
- Image upload and display
- Video upload with player controls
- File attachment support
- Cloudinary integration for media storage

### User Management
- Customizable user profiles
- Avatar upload
- Bio and display name
- User search functionality


## 📝 License

This project is licensed under the MIT License

## 👥 Authors

- Abhay Surya K S

## 🙏 Acknowledgments

- Firebase for backend services
- Cloudinary for media storage
- Tailwind CSS for styling
- React community for excellent documentation

## 🔮 Future Enhancements

- [ ] Group chat functionality
- [ ] Voice and video calls
- [ ] Message reactions and emojis
- [ ] Message editing and deletion
- [ ] Online/offline status indicators
- [ ] Push notifications
- [ ] Dark/light theme toggle
- [ ] Message encryption
