
import { setDoc, doc, getDocs, collection, getDoc, deleteDoc } from 'firebase/firestore'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { DataResponse, GenericItem } from '../types'
import { v4 } from 'uuid'
import db from '../config/firebase'
import fs from 'fs/promises'

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
interface IDao {
  addItem: (item: GenericItem) => Promise<DataResponse>
  getAll: () => Promise<DataResponse>
  getById: (id: string) => Promise<DataResponse>
  updateById: (id: string, item: GenericItem) => Promise<DataResponse>
  deleteById: (id: string) => Promise<DataResponse>
  uploadFile: (file: Express.Multer.File) => Promise<DataResponse>
}

export function DbManager (collectionStr: string): IDao {
  const collectionRef = collectionStr

  async function addItem (item: GenericItem): Promise<DataResponse> {
    const id = v4()
    if (item?.render === undefined) return new DataResponseClass([], 400, 'Render is not in the item object', 'Bad Request', false)
    else {
      return await setDoc(doc(db, collectionRef, id), { ...item, id })
        .then(() => new DataResponseClass([{ ...item, id }], 201, 'Item successfully created ', '', true))
        .catch(async (err: any) => await Promise.reject(new DataResponseClass([], 500, 'Failed to create the item', err.toString() as string, false)))
    }
  }

  async function getAll (): Promise<DataResponse> {
    return await getDocs(collection(db, collectionRef)).then((response: any) => {
      const dataArray: any = []
      response.forEach((item: any) => dataArray.push(item.data()))
      return new DataResponseClass(dataArray, 200, 'Information obtained', '', true)
    }).catch(async (err: any) => await Promise.reject(new DataResponseClass([], 400, 'Couldnt Retrieve data', err.toString(), false)))
  }

  async function getById (id: string): Promise<DataResponse> {
    if (typeof id !== 'string') return new DataResponseClass([], 400, 'Couldnt Retrieve data', 'ID is NOT a string', false)
    if (Object.prototype.toString.call(id) !== '[object String]') return new DataResponseClass([], 400, 'Couldnt Retrieve data', 'ID is NOT a string', false)
    const docRef = doc(db, collectionRef, id)
    return await getDoc(docRef)
      .then((docs: any) => {
        if (docs === undefined) throw new Error('Id doesnt exists')
        return new DataResponseClass(docs, 200, 'Data retrived', '', true)
      })
      .catch(async (err: any) => await Promise.reject(new DataResponseClass([], 400, 'Request failed', err, false)))
  }

  async function updateById (id: string, item: GenericItem): Promise<DataResponse> {
    if (Object.prototype.toString.call(item) !== '[object Object]') return new DataResponseClass([], 400, 'Item should be an object', 'Item is not an object', false)
    if (Object.prototype.toString.call(id) !== '[object String]') return new DataResponseClass([], 400, 'ID should be a string', 'Wrong ID', false)
    if (typeof id !== 'string') return new DataResponseClass([], 400, 'ID should be a string', 'Wrong ID', false)
    return await setDoc(doc(db, collectionRef, id), item)
      .then(() => new DataResponseClass([{ ...item, id }], 200, 'Item succesifuly updated', '', true))
      .catch(async (err: any) => await Promise.reject(new DataResponseClass([], 400, 'setDoc Failed', err.toString(), false)))
  }

  async function deleteById (id: string): Promise<DataResponse> {
    if (typeof id !== 'string') return await Promise.resolve(new DataResponseClass([], 400, 'ID should be a string', 'id is not a String', false))
    if (Object.prototype.toString.call(id) !== '[object String]') return await Promise.resolve(new DataResponseClass([], 400, 'ID should be a string', 'id is not a String', false))
    return await deleteDoc(doc(db, collectionRef, id))
      .then(() => new DataResponseClass([], 400, 'Delete success', '', true))
      .catch(async (err: any) => await Promise.reject(new DataResponseClass([], 200, 'Error procesing Database deleteDoc function', err as string, false)))
  }
  async function uploadFile (file: Express.Multer.File | undefined): Promise<DataResponseClass> {
    if (file?.path === undefined) return new DataResponseClass([], 400, 'The parameter should be a express.multer.file', 'Wrong param!!!', false)
    const buffer = await fs.readFile(file.path).then()
    const reference = ref(storage, `/${collectionRef}/${file.filename}`)
    try {
      console.log(await (uploadBytes(reference, buffer)))
      return new DataResponseClass(await getDownloadURL(reference) as any, 200, 'File uploaded succesfully', '', true)
    } catch (err) {
      return await Promise.reject(new DataResponseClass([], 400, 'Error uploading file', err as string, false))
    }
  }

  return { addItem, getAll, getById, updateById, deleteById, uploadFile }
}
