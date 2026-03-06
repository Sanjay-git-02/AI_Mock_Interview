
import { initializeApp,getApps,getApp } from "firebase/app";
import {getAuth} from "@firebase/auth"
import {getFirestore} from "@firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyC942g_0RE8XhjS-KhUGRyl69lbVpz-wto",
    authDomain: "prepwise-b1fc2.firebaseapp.com",
    projectId: "prepwise-b1fc2",
    storageBucket: "prepwise-b1fc2.firebasestorage.app",
    messagingSenderId: "660464130785",
    appId: "1:660464130785:web:3ce5e70ae0f0e3b67d35a0",
    measurementId: "G-L110PNX144"
};

// Initialize Firebase
const app =!getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);