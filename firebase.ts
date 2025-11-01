import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: 'AIzaSyAODEiRLoiGR6PAgjmk43UZPTZUbbiRED8',
  authDomain: 'midrand-elite-group.firebaseapp.com',
  projectId: 'midrand-elite-group',
  storageBucket: 'midrand-elite-group.firebasestorage.app',
  messagingSenderId: '953547892287',
  appId: '1:953547892287:web:1b2348b54b3d0aee947a8a',
  measurementId: 'G-NHTEFYXBRP',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);


// if (__DEV__) {
//   try {
//     connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
//     connectFirestoreEmulator(db, 'localhost', 8080);
//   } catch (error) {
//     console.error('Failed to connect to Firebase Emulator:', error);
//   }
// }

export { auth, db, storage };