import { DbManager } from '../services/firebase'
import { addGetDAO, updateDeleteDAO, DataResponse, GenericItem, readCreateData, editDeleteData } from '../types'
import { Request, Response } from 'express'
export abstract class DAO implements addGetDAO, updateDeleteDAO {
  constructor (
    protected readonly collectionRef: string
  ) {}
  abstract getAll (): Promise<DataResponse>
  abstract getById (id: string): Promise<DataResponse>
  abstract addItem (item: GenericItem): Promise<DataResponse>
  abstract updateById (id: string, item: GenericItem): Promise<DataResponse>
  abstract deleteByid (id: string): Promise<DataResponse>
}

export abstract class AbstractController implements readCreateData, editDeleteData {
  constructor (collection: string, protected readonly dbManager: DbManager = new DbManager(collection)) {}
  abstract readData (req: Request, res: Response): Promise<void>
  abstract createData (req: Request, res: Response): Promise<void>
  abstract editData (req: Request, res: Response): Promise<void>
  abstract deleteData (req: Request, res: Response): Promise<void>
}

// export abstract class AbstractValidator{}
