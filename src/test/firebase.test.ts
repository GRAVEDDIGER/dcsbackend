/* eslint-disable @typescript-eslint/no-unused-vars */

import { GenericItem } from '../types'
import { SnapshotDocuments } from './firebaseMocks'
import { it, describe, expect, vi, afterEach, beforeAll, beforeEach, afterAll } from 'vitest'
import color from 'colors'
import { DbManager } from '../services/firebaseTDD'
const storage = vi.fn().mockResolvedValue({})
const ref = vi.fn().mockReturnValue('/welcome/')
const deleteDoc = vi.fn()
  .mockRejectedValueOnce('')
  .mockReturnValue(Promise.resolve())
const uploadBytes = vi.fn()
  .mockRejectedValueOnce('')
  .mockResolvedValue(Promise.resolve())

const setDoc = vi.fn()
  .mockRejectedValueOnce('')
  .mockReturnValue(Promise.resolve())

const getDoc = vi.fn()
  .mockRejectedValueOnce('')
  .mockResolvedValue(Promise.resolve(new SnapshotDocuments(true, 'algo lindo', 'Genial NO?')))

const getDocs = vi.fn()
  .mockRejectedValueOnce('')
  .mockResolvedValue(Promise.resolve([new SnapshotDocuments(true, 'Titulo', 'Descripcion'), new SnapshotDocuments(true, 'Otro Title', 'Otra Descripcion'), new SnapshotDocuments(true, 'Intereesante', 'Que se yo...')]))

const dbManager = DbManager('welcome')
/// /////////////////////////////////////////
//                TESTS                   //
/// ////////////////////////////////////////

describe('DbManager addItem tests', () => {
  afterAll(() => {
    setDoc.mockClear()
  })
  it('Should return ok:false if setDoc is rejected', async () => {
    dbManager.addItem({ description: 'texto', title: 'texto', render: true } as any)
      .then((res) => {
        expect(res).toContain({ ok: false })
        console.log(color.bgGreen.bold('Resolved setdoc'))
      })
      .catch(err => {
        expect(err).toContain({ ok: false })
        console.log(color.bgRed.white.bold('Rejected setDocs'))
      })
  })
  it('Should return ok:true if setDoc is rejected', async () => {
    dbManager.addItem({ description: 'texto', title: 'texto', render: true } as any)
      .then(() => console.log(color.bgGreen.bold('Resolved setdoc')))
      .catch(err => console.log(color.bgRed.white.bold(err)))
  })
  it('should return false if render is not in the object', async () => {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    expect(await dbManager.addItem({ description: 'texto', title: 'texto' } as GenericItem)).toContain({ ok: false })
  })
}
)
describe('DbManager getAll functions', () => {
  it('Should return ok:false in getDocs.reject()', async () => {
    dbManager.getAll()
      .then(() => console.log(color.bgGreen.bold('Resolved getDocs')))
      .catch((err: any) => {
        expect(err).toContain({ ok: false })
        console.log(color.bgRed.white.bold(`Rejected getDocs ${err.err.toString() as string}`))
      })
  })
  it('Should return ok:true in getDocs.resolve()', async () => {
    dbManager.getAll()
      .then((res) => {
        expect(res).toContain({ ok: true })
        console.log(color.bgGreen.bold('Resolved getDocs'))
      })
      .catch((err: any) => {
        console.log(color.bgRed.white.bold(`Rejected getDocs ${err.err.toString() as string}`))
      })
  })
})

describe('DbManager getById', () => {
  it('should get a false value in getDoc Reject', async () => {
    dbManager.getById('texto')
      .then(() => console.log(color.bgGreen.bold('Resolved getDoc')))
      .catch((err) => {
        console.log(color.bgRed.white.bold('Rejected getDoc'))
        expect(err).toContain({ ok: false })
      })
  })
  it('should get a true value in getDoc Resolves', async () => {
    dbManager.getById('texto')
      .then((res) => {
        console.log(color.bgGreen.bold('Resolved getDoc'))
        expect(res).toContain({ ok: true })
      })
      .catch(() => {
        console.log(color.bgRed.white.bold('Rejected getDoc'))
      })
  })
})
describe('dbManager Update By ID Tests', async () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  beforeAll(() => {
    setDoc.mockRestore()
    setDoc.mockRejectedValueOnce('')
      .mockReturnValue(Promise.resolve())
  })
  it('Should return ok:false if setDocs is rejected', async () => {
    dbManager.updateById('texto', {} as any)
      .then((res) => console.log(color.bgGreen.white.bold('Resolved setDoc ')))
      .catch(err => {
        console.log(color.bgRed.white.bold('Rejected setDoc '))
        expect(err).toContain({ ok: false })
      })
  })
  it('Should return ok:false if setDocs is rejected', async () => {
    dbManager.updateById('texto', {} as any)
      .then((res) => {
        expect(res).toContain({ ok: true })
        console.log(color.bgGreen.white.bold('Resolved setDoc'))
      })
      .catch(err => {
        console.log(color.bgRed.white.bold('Rejected setDoc '))
        expect(err).toContain({ ok: false })
      })
  })

  it('Should contain false if id is not a string', async () => {
    expect(await dbManager.updateById(1 as any, undefined as any)).toContain({ ok: false })
    expect(await dbManager.updateById({} as any, undefined as any)).toContain({ ok: false })
    expect(await dbManager.updateById(true as any, undefined as any)).toContain({ ok: false })
    expect(await dbManager.updateById(NaN as any, undefined as any)).toContain({ ok: false })
  })
  it('Response should contain false if item is not an object', async () => {
    expect(await dbManager.updateById('00637abb-40c2-4e04-bcd9-b395555ef99f', undefined as any)).toContain({ ok: false })
    expect(await dbManager.updateById('00637abb-40c2-4e04-bcd9-b395555ef99f', 1 as any)).toContain({ ok: false })
    expect(await dbManager.updateById('00637abb-40c2-4e04-bcd9-b395555ef99f', true as any)).toContain({ ok: false })
  })
})

describe('dBManager deleteById function testing', async () => {
  it('Should return ok:false on reject', async () => {
    dbManager.deleteById('string id')
      .then(() => console.log(color.bgGreen.bold.black('DeleteDoc promise resolved ')))
      .catch((err) => {
        console.log(color.bgRed.white.bold('DeleteDoc Promise rejected'))
        expect(err).toContain({ ok: false })
      })
  })
  it('Should return ok:true on resolve', async () => {
    dbManager.deleteById('string id')
      .then((res) => {
        console.log(color.bgGreen.bold.black('DeleteDoc promise resolved'))
        expect(res).toContain({ ok: true })
      })
      .catch((err) => {
        console.log(color.bgRed.white.bold(`DeleteDoc Promise rejected ${err as string}`))
      })
  })
  it('Should return a false value when a not string value is passed', async () => {
    expect(await dbManager.deleteById(1 as any)).toContain({ ok: false })
    expect(await dbManager.deleteById({} as any)).toContain({ ok: false })
    expect(await dbManager.deleteById(NaN as any)).toContain({ ok: false })
    expect(await dbManager.deleteById(1 as any)).toContain({ ok: false })
  })
})

describe('uploadFile Tests', () => {
  it('Test Rejected State of upload Bytes', async () => {
    const file = { path: 'src/index.ts', filename: './src/index.ts' }
    dbManager.uploadFile(file as any)
      .then(() => console.log('resolved'))
      .catch(err => {
        console.log(color.bgRed.white.bold('uploadBytes Promise Rejected'))
        expect(err).toContain({ ok: false })
      })
  })
  it('Test Resolved State of uploadBytes', async () => {
    const file = { path: 'src/index.ts', filename: './src/index.ts' }
    dbManager.uploadFile(file as any)
      .then((response) => {
        console.log(color.bgGreen.white.bold('uploadBytes Promise Resolved'))
        expect(response).toContain({ ok: true })
      })
      .catch(err => console.log(color.bgRed.white.bold(`Promise rejected  ${err as string}`)))
  })
  it('should return a DataResponse false if arguments are not Multer File Object type', async () => {
    expect(await dbManager.uploadFile(1 as any)).toContain({ ok: false })
  })
})
