import { NextFunction, Request, Response } from 'express'
export interface Welcome {
  id?: string
  title: string
  description: string
  timeStamp: number
  render: boolean
  images: string[]
}
export interface Member {
  id?: string
  name: string
  function: string
  description: string
  render: boolean
  images: string[]
  timeStamp: number
}
export interface Post {
  id?: string
  title: string
  content: string
  author: string
  render: boolean
  images: string[]
  timeStamp: number
}

export interface Learning {
  id?: string
  title: string
  content: string
  render: boolean
  images: string[]
  timeStampo: number
}
export interface GenericItem {
  id?: string
  item: Post | Welcome | Member | Learning
}
export interface DataResponse {
  data: GenericItem[]
  status: number
  statusText: string
  err: string
}
export interface ValidationObject {
  title?: RegExp
  content?: RegExp
  author?: RegExp
  description?: RegExp
  name?: RegExp
  function?: RegExp
}
export type ValidationStrings = 'post' | 'members' | 'welcome' | 'learning'
export interface ValidationType {
  private readonly welcome?: ValidationObject
  members?: ValidationObject
  post?: ValidationObject
  learning?: ValidationObject
  validator: ValidationStrings
  validate: (req: Request, res: Response, next: NextFunction) => Promise<void>
}

export interface addGetDAO {
  getAll: () => Promise<DataResponse>
  getById: (id: string) => Promise<DataResponse>
  addItem: (item: GenericItem) => Promise<DataResponse>

}
export interface updateDeleteDAO {
  updateById: (id: string, item: GenericItem) => Promise<DataResponse>
  deleteByid: (id: string) => Promise<DataResponse>

}
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

abstract class Controller {
  constructor (
    protected readonly collection: string
  ) {}
}
