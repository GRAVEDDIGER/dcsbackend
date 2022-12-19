import { getDocs, collection,setDoc ,doc, CollectionReference, DocumentData} from "firebase/firestore";
import { Welcome, Member, Learning, Post } from '../types'
import {v4} from 'uuid'
import db from "../config/firebase";
import { Collection } from "typescript";
const coleccion = collection(db, 'Bienvenido')

export class dbManager {
    private readonly collectionRef: string
    constructor(collectionRef: string) {
        this.collectionRef=collectionRef
    }
    async addItem(item: Post | Welcome | Member | Learning, ): Promise<void>{
        const id = v4()
        console.log(id,typeof id)
        setDoc(doc(db,this.collectionRef,id), {...item,id }).then(res=>console.log(res))
       
    }
}
const try1: Welcome = { title: "texto", description: "Texto de nuevo", timeStamp: Date.now() }
const dbm = new dbManager('Bienvenido')
dbm.addItem(try1)