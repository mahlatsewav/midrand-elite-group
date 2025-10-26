# Midrand Elite Group (MEG) Mobile Application

## Overview

The Midrand Elite Group (MEG) Mobile Application is a cross-platform solution designed to connect informal workers with local job opportunities. Built as part of a Bachelor of Science in Information Technology: Mobile Application and Web Services mini-dissertation at Eduvos, this app addresses the inefficiency in job matching within informal sectors. The prototype features user registration, service request creation, worker assignment, and real-time updates, leveraging modern mobile development tools and cloud services.

### Key Features
- **User Authentication**: Role-based sign-in/up/out for clients and workers using Firebase Authentication.
- **Service Request Management**: Create, read, update, and delete (CRUD) requests with real-time syncing via Firestore.
- **Responsive UI**: Dark-themed layouts designed with NativeWind, adaptable to Android and iOS.
- **Real-Time Updates**: Live job assignment and status changes using Firebase's real-time database.

### Technologies Used
- **React Native** with **Expo**: For cross-platform mobile development.
- **NativeWind**: For Tailwind CSS-inspired styling.
- **Expo Router**: For navigation management.
- **Firebase**: For authentication, Firestore database, and storage.

### Team Members
- Mahlatse Lepako
- Thabiso Mosime
- Lilian Mabunda
- Mukona Musia
- Mehlika Ebrar Uluçay
- Siyabonga Phakathi 

### Supervisor
- Sewisha Thabo Lehong

## Installation
Follow these steps to set up the project locally:

### Prerequisites
- Node.js (v16.x or later)
- Expo CLI (`npm install -g expo-cli`)
- Firebase account and project setup
- Android/iOS emulator or physical device

### Steps
1. **Clone the Repository**
   git clone https://github.com/your-username/meg-mobile-app.git
   cd meg-mobile-app

2. **Install Dependencies**
   npm install

2. **Configure Firebase**
- Create a Firebase project at Firebase Console.
- Enable Authentication (Email/Password) and Firestore.
- Set up Firebase Storage for image uploads.
- Download the google-services.json (Android) and GoogleService-Info.plist (iOS) files and place them in the respective project folders (e.g., android/app/ and ios/).
- Update firebase.js with your Firebase configuration:

   import { initializeApp } from 'firebase/app';
   import { getAuth } from 'firebase/auth';
   import { getFirestore } from 'firebase/firestore';
   import { getStorage } from 'firebase/storage';

   const firebaseConfig = {
   apiKey: "your-api-key",
   authDomain: "your-auth-domain",
   projectId: "your-project-id",
   storageBucket: "your-storage-bucket",
   messagingSenderId: "your-sender-id",
   appId: "your-app-id"
   };

   const app = initializeApp(firebaseConfig);
   export const auth = getAuth(app);
   export const db = getFirestore(app);
   export const storage = getStorage(app);

4. **Start the Development Server** 
- expo start
- Use the Expo Go app on a physical device or an emulator to preview the app.
- Press a (Android) or i (iOS) to launch in an emulator.

### Usage
Key Screens:
- Sign In/Sign Up: Authenticate users with role selection (client/worker).
- Home (Client Dashboard): View and create service requests.
- Worker Dashboard: View and accept available jobs.
- New Request: Submit requests with optional image uploads.
- Profile: View user details and sign out.

### Example Workflow
- Sign up as a "client" and create a request (e.g., "House Cleaning").
- Sign in as a "worker" to view and accept the request.
- Monitor real-time updates as the status changes (e.g., "To Do" to "In Progress").

### Coding Standards
- Use TypeScript for type safety.
- Follow NativeWind class naming conventions.
- Document new functions with JSDoc.

### Contact
For questions or collaboration, reach out to:
Mahlatse Lepako: mahlatselepako@gmail.com
Or open an issue on this repository.