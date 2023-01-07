import { NextFunction, Request, Response } from 'express'
export interface Welcome {
  id?: string
  title: string
  description: string
  timeStamp: number
  render: boolean
  images: string[]
}
export interface About {
  id?: string
  name: string
  function: string
  description: string
  render: boolean
  images: string[]
  timeStamp: number
}
export interface News {
  id?: string
  title: string
  content: string
  author: string
  render: boolean
  images: string[]
  timeStamp: number
}

export interface Volunteers {
  id?: string
  title: string
  content: string
  render: boolean
  images: string[]
  timeStamp: number
}
export type AnyDataPosted = Partial <Omit <(Welcome & News & About & Volunteers), 'timeStamp'>>
export type AnyDataKeys = Partial<keyof(AnyDataPosted)>

export interface GenericItem {
  id?: string
  item: News | Welcome | About | Volunteers
}
export interface DataResponse {
  data: GenericItem[]
  status: number
  statusText: string
  err: string
}
export interface ValidationObject {
  title?: { regExp: RegExp, code: string, description: string }
  content?: { regExp: RegExp, code: string, description: string }
  author?: { regExp: RegExp, code: string, description: string }
  description?: { regExp: RegExp, code: string, description: string }
  name?: { regExp: RegExp, code: string, description: string }
  function?: { regExp: RegExp, code: string, description: string }
  render?: { regExp: RegExp, code: string, description: string }
}
export type ValidationStrings = 'news' | 'about' | 'welcome' | 'volunteers'
export interface ValidationError {
  ok: boolean
  err: string
}
export interface ValidationType {
  welcome?: ValidationObject
  About?: ValidationObject
  news?: ValidationObject
  Volunteers?: ValidationObject
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
export interface IController {
  readData: (req: Request, res: Response) => Promise<void>
  createData: (req: Request, res: Response) => Promise<void>
  editData: (req: Request, res: Response) => Promise<void>
  deleteData: (req: Request, res: Response) => Promise<void>
}
export interface readCreateData {
  readData: (req: Request, res: Response) => Promise<void>
  createData: (req: Request, res: Response) => Promise<void>

}
export interface editDeleteData {
  editData: (req: Request, res: Response) => Promise<void>
  deleteData: (req: Request, res: Response) => Promise<void>

}
// export interface
