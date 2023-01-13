
import { setDoc, doc, getDocs, collection, getDoc, deleteDoc } from 'firebase/firestore'
// import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
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
interface IDao {
  addItem: (item: GenericItem) => Promise<DataResponse>
  getAll: () => Promise<DataResponse>
  getById: (id: string) => Promise<DataResponse>
  updateById: (id: string, item: GenericItem) => Promise<DataResponse>
  deleteById: (id: string) => Promise<DataResponse>
}
export function DbManager (collectionStr: string): IDao {
  const collectionRef = collectionStr

  async function addItem (item: GenericItem): Promise<DataResponse> {
    const id = v4()
    if (!('render' in item.item)) return new DataResponseClass([], 400, 'Render is not in the item object', 'Bad Request', false)
    else {
      return await setDoc(doc(db, collectionRef, id), { ...item.item, id })
        .then(() => new DataResponseClass([{ ...item, id }], 201, 'Item successfully created ', '', true))
        .catch(() => new DataResponseClass([], 500, 'Failed to create the item', 'Failed conenection', false))
    }
  }

  async function getAll (): Promise<DataResponse> {
    return await getDocs(collection(db, collectionRef)).then(response => {
      const dataArray: any = []
      response.forEach(item => dataArray.push(item.data()))
      return new DataResponseClass(dataArray, 200, 'Information obtained', '', true)
    }).catch(err => new DataResponseClass([], 400, 'Couldnt Retrieve data', err.toString(), false))
  }

  async function getById (id: string): Promise<DataResponse> {
    if (typeof id !== 'string') return new DataResponseClass([], 400, 'Couldnt Retrieve data', 'ID is NOT a string', false)
    if (Object.prototype.toString.call(id) !== '[object String]') return new DataResponseClass([], 400, 'Couldnt Retrieve data', 'ID is NOT a string', false)
    const docRef = doc(db, collectionRef, id)
    const docs: GenericItem = await getDoc(docRef) as unknown as GenericItem
    const tempArray: GenericItem[] = []
    tempArray.push({ ...docs })
    if (docs !== undefined) return new DataResponseClass(tempArray, 200, 'Data retrived', '', true)
    return new DataResponseClass([], 400, 'Request failed', 'Document doesnt exists', false)
  }

  async function updateById (id: string, item: GenericItem): Promise<DataResponse> {
    if (typeof id !== 'string') return new DataResponseClass([], 400, 'ID should be a string', 'Wrong ID', false)
    if (Object.prototype.toString.call(id) !== '[object String]') return new DataResponseClass([], 400, 'ID should be a string', 'Wrong ID', false)
    if (Object.prototype.toString.call(item) !== '[object Object]') return new DataResponseClass([], 400, 'Item should be an object', 'Item is not an object', false)
    return await setDoc(doc(db, collectionRef, id), item)
      .then(() => new DataResponseClass([{ ...item, id }], 200, 'Item succesifuly updated', '', true))
      .catch(err => new DataResponseClass([], 400, 'Couldnt update item', err.toString(), false))
  }

  async function deleteById (id: string): Promise<DataResponse> {
    if (typeof id !== 'string') return await Promise.resolve(new DataResponseClass([], 400, 'ID should be a string', 'id is not a String', false))
    if (Object.prototype.toString.call(id) !== '[object String]') return await Promise.resolve(new DataResponseClass([], 400, 'ID should be a string', 'id is not a String', false))

    try {
      await deleteDoc(doc(db, collectionRef, id))
      return new DataResponseClass([], 400, 'Delete success', '', true)
    } catch (err: any) { return await Promise.resolve(new DataResponseClass([], 400, 'Error procesing Database deleteDoc function', err as string, false)) }
  }
  return { addItem, getAll, getById, updateById, deleteById }
}
