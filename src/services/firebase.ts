import { setDoc, doc, getDocs, collection, query, where, deleteDoc } from 'firebase/firestore'
import { DataResponse, GenericItem } from '../types'
import { v4 } from 'uuid'
import db from '../config/firebase'
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
export class DbManager {
  private readonly collectionRef: string
  constructor (collectionRef: string) {
    this.collectionRef = collectionRef
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
      .catch(err => new DataResponseClass([], 400, 'Couldnt Retrieve data', err.toString(), false))
  }

  async deleteByid (id: string): Promise<DataResponse> {
    return await deleteDoc(doc(db, this.collectionRef, id))
      .then(() => new DataResponseClass([], 200, 'Success deleting a document', '', true))
      .catch(err => new DataResponseClass([], 400, 'Couldnt Delete data', err, false))
  }
}
// const try1: Welcome = { title: 'Adrian', description: 'El groso', timeStamp: Date.now(), render: false, images: [] }
const dbm = new DbManager('Bienvenido')
dbm.getById('d8552bd4-12a8-1dce-bc83-ec3499343b3a').then(response => console.log(response)).catch(err => console.log(err))
