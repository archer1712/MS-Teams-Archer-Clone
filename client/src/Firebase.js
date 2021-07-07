import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

const app = firebase.initializeApp({
    apiKey: "AIzaSyCGTXcXwUmnmHpzWuTFjmdUetnEozGfayk",
    authDomain: "msteams-auth-development.firebaseapp.com",
    projectId: "msteams-auth-development",
    storageBucket: "msteams-auth-development.appspot.com",
    messagingSenderId: "643876383516",
    appId: "1:643876383516:web:36040df64d15299cb268d9"
})

export const auth = app.auth()
export const firestore = app.firestore();
export default app