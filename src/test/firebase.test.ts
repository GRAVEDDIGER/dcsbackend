/* eslint-disable @typescript-eslint/no-useless-constructor */
import { setDoc, doc, getDocs, collection, query, where, deleteDoc, getDoc } from 'firebase/firestore'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { DataResponse, GenericItem, AnyDataPosted } from '../types'
import { DAO } from '../clases/abstractClasses'
import { v4 } from 'uuid'
import db from '../config/firebase'
/// //////////////////////////////////////
import { it, describe, expect } from 'vitest'

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

  }

  async function deleteById (id: string): Promise<DataResponse> {

  }
  return { addItem, getAll, getById, updateById, deleteById }
}
const dbManager = DbManager('welcome')
console.log(dbManager.addItem)
describe('DbManager addItem tests', () => {
  it('addItem should be a function', () => {
    expect(typeof dbManager.addItem).toBe('function')
  })
  it('should return false if render is not in the object', async () => {
    expect(await dbManager.addItem({ item: { description: 'texto', title: 'texto' } })).toContain({ ok: false })
  })
  it('Should return ok if render is present in the object', async () => {
    expect(await dbManager.addItem({ item: { description: 'texto', title: 'titulo', render: true } })).toContain({ ok: true })
  })
})
describe('DbManager getAll functions', () => {
  it('Should be a function', () => {
    expect(typeof dbManager.getAll).toBe('function')
  })
})
describe('DbManager getById', () => {
  it('Should contain false if id is not a string', async () => {
    expect(await dbManager.getById(1)).toContain({ ok: false })
    expect(await dbManager.getById({})).toContain({ ok: false })
    expect(await dbManager.getById(true)).toContain({ ok: false })
    expect(await dbManager.getById(NaN)).toContain({ ok: false })
  })
  it('Should return un valor truthy si param es tipo string', async () => {
    expect(dbManager.getById('00637abb-40c2-4e04-bcd9-b395555ef99f')).toBeTruthy()
  })
})
