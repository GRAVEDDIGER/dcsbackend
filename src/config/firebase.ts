import { FirebaseOptions, initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { config } from 'dotenv'
config()
console.log(process.env)
const constant = JSON.parse(process.env.FIREBASECONFIG as string)
console.log(constant)
const app = initializeApp(constant as FirebaseOptions)
export const db = getFirestore(app)
export default db
