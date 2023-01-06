import { FirebaseOptions, initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { config } from 'dotenv'
config()
const constant = JSON.parse(process.env.FIREBASECONFIG as string)
const app = initializeApp(constant as FirebaseOptions)
export const db = getFirestore(app)
export default db
