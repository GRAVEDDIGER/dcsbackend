import {initializeApp } from 'firebase/app'
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyBnFChqPrUeaa8T-PgTxlkTp-UZByvMhCI",
  authDomain: "defensacivilsaladillo-18702.firebaseapp.com",
  projectId: "defensacivilsaladillo-18702",
  storageBucket: "defensacivilsaladillo-18702.appspot.com",
  messagingSenderId: "991734746643",
  appId: "1:991734746643:web:ce0ce917d908abaad2f9e6"
};
const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export default db