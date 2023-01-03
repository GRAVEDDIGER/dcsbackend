/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-useless-constructor */
import { setDoc, doc, getDocs, collection, query, where, deleteDoc } from 'firebase/firestore'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { DataResponse, GenericItem } from '../types'
import { DAO } from '../clases/abstractClasses'
import { v4 } from 'uuid'
import db from '../config/firebase'
// import fs from 'fs/promises'
const fs = require('fs').promises
const storage = getStorage()
export class DataResponseClass implements DataResponse {
  data: GenericItem[]
  status: number
  statusText: string
  err: string
  ok: boolean
  constructor (data: GenericItem[], status: number, statusText: string, err: string, ok: boolean) {
    this.data = data
    this.status = status
    this.statusText = statusText
    this.err = err
    this.ok = ok
  }
}
export class DbManager extends DAO {
  constructor (collectionRef: string) {
    super(collectionRef)
  }

  async addItem (item: GenericItem): Promise<DataResponse> {
    const id = v4()
    console.log(id, typeof id)
    return await setDoc(doc(db, this.collectionRef, id), { ...item, id }).then(res => {
      return new DataResponseClass([{ ...item, id }], 201, 'Item added successfully', '', true)
    }).catch(err => {
      return new DataResponseClass([item], 400, "Couldn't add item", err.toString(), false)
    })
  }

  async getAll (): Promise<DataResponse> {
    return await getDocs(collection(db, this.collectionRef)).then(response => {
      const dataArray: any = []
      response.forEach(item => dataArray.push(item.data()))
      return new DataResponseClass(dataArray, 200, 'Information obtained', '', true)
    }).catch(err => new DataResponseClass([], 400, 'Couldnt Retrieve data', err.toString(), false))
  }

  async getById (passedId: string): Promise<DataResponse> {
    const q = query(collection(db, this.collectionRef), where('id', '==', passedId))
    return await getDocs(q)
      .then(res => {
        const dataArray: any[] = []
        res.forEach(item => {
          dataArray.push(item.data())
        })
        if (dataArray.length === 0) throw new Error('No data found for the id')
        return new DataResponseClass(dataArray, 200, 'Information obtained', '', true)
      })
      .catch(err => new DataResponseClass([], 400, 'Couldnt Retrieve data', err.toString(), false))
  }

  async updateById (id: string, item: GenericItem): Promise<DataResponse> {
    return await setDoc(doc(db, this.collectionRef, id), item)
      .then(() => new DataResponseClass([{ ...item, id }], 200, 'Item succesifuly updated', '', true))
      .catch(err => new DataResponseClass([], 400, 'Couldnt update item', err.toString(), false))
  }

  async deleteByid (id: string): Promise<DataResponse> {
    return await deleteDoc(doc(db, this.collectionRef, id))
      .then(() => new DataResponseClass([], 200, 'Success deleting a document', '', true))
      .catch(err => new DataResponseClass([], 400, 'Couldnt Delete data', err, false))
  }

  async upLoadFile (file: Express.Multer.File | undefined): Promise<string> {
    if (file !== undefined) {
      const buffer = await fs.readFile(file.path).then()
      const reference = ref(storage, `/${this.collectionRef}/${file.filename}`)
      try {
        await uploadBytes(reference, buffer)
        return await getDownloadURL(reference)
      } catch (err: any) {
        console.log(err)
        return 'There was an error uploading the file'
      }
    }
    return 'No file was uploaded'
  }
}
