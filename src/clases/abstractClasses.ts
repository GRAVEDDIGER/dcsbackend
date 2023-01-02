import { addGetDAO, updateDeleteDAO, DataResponse, GenericItem } from '../types'
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
