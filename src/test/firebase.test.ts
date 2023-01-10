/* eslint-disable @typescript-eslint/return-await */
/* eslint-disable @typescript-eslint/no-useless-constructor */

import { setDoc, doc, getDocs, collection, getDoc } from 'firebase/firestore'
// import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { DataResponse, GenericItem } from '../types'
import { QuerySnapshot, SnapshotDocuments } from './firebaseMocks'
// import { DAO } from '../clases/abstractClasses'
import { v4 } from 'uuid'
import db from '../config/firebase'
/// //////////////////////////////////////
import { it, describe, expect, vi, beforeEach, afterAll } from 'vitest'
import { afterEach } from 'node:test'
vi.mock('../node_modules/firebase/firestore')
// const setDoc = vi.fn().mockReturnValue(new Promise<void>((res, rej) => {
//   res(
//     // {
//     // data: () => {
//     //   return { ok: true }
//     // }
//   // }
//   )
// }))
// const getDoc=vi.fn().mockReturnValue(new Promise((resolve, reject) => {})

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

  }
  return { addItem, getAll, getById, updateById, deleteById }
}

const dbManager = DbManager('welcome')
/// /////////////////////////////////////////
//                TESTS                   //
/// ////////////////////////////////////////

describe('DbManager addItem tests', () => {
  const setDoc = vi.fn().mockReturnValueOnce(Promise.resolve())
  beforeEach(setDoc.mockClear())

  it('addItem should be a function', () => {
    expect(typeof dbManager.addItem).toBe('function')
  })
  it('should return false if render is not in the object', async () => {
    expect(await dbManager.addItem({ item: { description: 'texto', title: 'texto' } })).toContain({ ok: false })
  })
  it('Should return ok if render is present in the object', async () => {
    expect(await dbManager.addItem({ item: { description: 'texto', title: 'titulo', render: true } })).toContain({ ok: true })
  })
  it('Expect setDoc to be called', async () => {
    const cosa = await dbManager.addItem({ item: { render: true, description: 'Adrian' } })
    expect(setDoc).toHaveBeenCalled()
    expect(cosa).toBeInstanceOf(DataResponseClass)
  })
})
describe('DbManager getAll functions', () => {
  const getDocs = vi.fn().mockReturnValue(Promise.resolve(new QuerySnapshot([new SnapshotDocuments(true, 'algo', 'titulo'), new SnapshotDocuments(true, 'algo mas', 'titulo 1'), new SnapshotDocuments(true, 'something', 'title'), new SnapshotDocuments(true, 'something else', 'titulo')])))
  beforeEach(getDocs.mockClear())
  it('Should be a function', () => {
    expect(typeof dbManager.getAll).toBe('function')
  })
  it('Should call getDocs', async () => {
    const respuesta = await dbManager.getAll()
    expect(getDocs).toHaveBeenCalled()
    expect(respuesta).toBeInstanceOf(DataResponseClass)
  })
})

describe('DbManager getById', () => {
  const getDoc = vi.fn().mockReturnValue(new SnapshotDocuments(true, 'algo lindo', 'Genial NO?'))
  beforeEach(getDoc.mockClear())
  it('Should contain false if id is not a string', async () => {
    expect(await dbManager.getById(1)).toContain({ ok: false })
    expect(await dbManager.getById({})).toContain({ ok: false })
    expect(await dbManager.getById(true)).toContain({ ok: false })
    expect(await dbManager.getById(NaN)).toContain({ ok: false })
  })
  it('Should return un valor truthy si param es tipo string', async () => {
    const respuesta = await dbManager.getById('00637abb-40c2-4e04-bcd9-b395555ef99f')
    expect(getDoc).toHaveBeenCalled()
    expect(respuesta).toBeInstanceOf(DataResponseClass)
  })
})
describe('dbManager Update By ID Tests', async () => {
  const response = await dbManager.updateById('00637abb-40c2-4e04-bcd9-b395555ef99f', { render: true, title: 'algun buen titulo', description: 'habrial que pensarlo' })

  const setDoc = vi.fn().mockReturnValue(Promise.resolve({}))
  beforeEach(setDoc.mockClear())
  it('should be a function', () => {
    expect(typeof dbManager.updateById).toBe('function')
  })
  it('Should contain false if id is not a string', async () => {
    expect(await dbManager.updateById(1)).toContain({ ok: false })
    expect(await dbManager.updateById({})).toContain({ ok: false })
    expect(await dbManager.updateById(true)).toContain({ ok: false })
    expect(await dbManager.updateById(NaN)).toContain({ ok: false })
  })
  it('Response should contain false if item is not an object', async () => {
    expect(await dbManager.updateById('00637abb-40c2-4e04-bcd9-b395555ef99f')).toContain({ ok: false })
    expect(await dbManager.updateById('00637abb-40c2-4e04-bcd9-b395555ef99f', 1)).toContain({ ok: false })
    expect(await dbManager.updateById('00637abb-40c2-4e04-bcd9-b395555ef99f', true)).toContain({ ok: false })
  })
  it('setDoc should be called at least once', () => {
    expect(setDoc).toHaveBeenCalled()
  })
  it('should return a DataResponseClass instance', () => {
    expect(response).toBeInstanceOf(DataResponseClass)
  })
})
