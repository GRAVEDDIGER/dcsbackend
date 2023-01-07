import { Request, Response, NextFunction } from 'express'
import { GenericItem, DataResponse, AnyDataPosted, AnyDataKeys } from '../types'
class DataResponseClass implements DataResponse {
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
interface IvalidationMiddleware {
  run: (req: Request, res: Response, next: NextFunction) => void
  validate: (validationObject: any) => boolean
}
function ValidationMiddleware (): IvalidationMiddleware {
  const isText = (obj: string | boolean): boolean => Object.prototype.toString.call(obj) === '[Object String]' || typeof obj === 'string'

  const validateText = (text: string): boolean => text.length > 3
  const validate = (validationObject: AnyDataPosted): boolean => {
    if ((validationObject?.render) === undefined) {
      return false
    }
    const boolArray: boolean[] = []
    const bodyKeys: AnyDataKeys[] = Object.keys(validationObject) as AnyDataKeys[]
    console.log('llego hasta el render', ('render' in validationObject), validationObject)
    if (!('render' in validationObject)) return false

    bodyKeys.forEach(clave => {
      if (clave !== undefined) {
        if (typeof validationObject[clave] !== 'undefined') {
          if (isText(validationObject[clave] as string)) boolArray.push(validateText(validationObject[clave] as string))
        }
      }
    })
    const respuesta = !boolArray.includes(false)
    console.log(respuesta)
    return respuesta
  }
  const run = (req: Request, res: Response, next: NextFunction): void => {
    if (validate(req?.body)) next()
    else res.status(400).send(new DataResponseClass([], 400, 'Failed Validation', 'Failed Validation', false))
  }

  return { run, validate }
}
export const ValMiddleWare = ValidationMiddleware()
