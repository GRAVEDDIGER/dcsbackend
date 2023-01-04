import { FirebaseOptions, initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { config } from 'dotenv'
config()
const constant = process.env.FIREBASECONFIG
console.log(constant)
const app = initializeApp(constant as FirebaseOptions)
export const db = getFirestore(app)
export default db
