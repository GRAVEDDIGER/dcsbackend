import { Request, Response, NextFunction } from 'express'
import { GenericItem, DataResponse, AnyDataPosted, AnyDataKeys, DataObjectVal } from '../types'
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
  validate: (validationObject: any) => DataResponse
}
function ValidationMiddleware (): IvalidationMiddleware {
  const isText = (obj: string | boolean): boolean => Object.prototype.toString.call(obj) === '[Object String]' || typeof obj === 'string'

  const validateText = (text: string): boolean => text.length > 3
  const validate = (validationObject: AnyDataPosted): DataResponse => {
    const boolArray: DataObjectVal[] = []
    const bodyKeys: AnyDataKeys[] = Object.keys(validationObject) as AnyDataKeys[]
    if (validationObject?.render === undefined) return new DataResponseClass([], 400, 'Bad Request didnt provide a render status', 'Bad request coudlnt findrender status', false)
    if (!('render' in validationObject)) return new DataResponseClass([], 400, 'Bad Request didnt provide a render status', 'Bad request coudlnt find render status', false)
    bodyKeys.forEach(clave => {
      if (clave !== undefined) {
        if (typeof validationObject[clave] !== 'undefined') {
          if (isText(validationObject[clave] as string)) boolArray.push({ ok: validateText(validationObject[clave] as string), key: clave })
        }
      }
    })
    if (boolArray.find(item => !item.ok) === undefined) {
      return new DataResponseClass([], 200, 'Information Validated', '', true)
    } else return new DataResponseClass([], 200, 'The field list provided on Data didnt pass validation', 'Validation failed', false)
  }
  const run = (req: Request, res: Response, next: NextFunction): void => {
    const condicion = validate(req.body)
    if (condicion.ok) {
      next()
    } else res.status(condicion.status).send(condicion)
  }
  return { run, validate }
}
export const ValMiddleWare = ValidationMiddleware()
