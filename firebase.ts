import { initializeApp } from 'firebase/app';
// @ts-ignore
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";

import AsyncStorage from "@react-native-async-storage/async-storage";

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

//   Auth instance
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
