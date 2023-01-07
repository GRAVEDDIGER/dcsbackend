/* eslint-disable @typescript-eslint/no-dynamic-delete */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { NextFunction, Request, Response } from 'express'
import { ValidationStrings, ValidationObject, ValidationType, ValidationError } from '../types'
// import { DataResponseClass } from '../services/firebase'

export class Validation implements ValidationType {
  readonly welcome: ValidationObject = {
    title: { regExp: /[0-9a-zA-Z!¡#%@&ÁÉéÍíÓóÚúá]{3}/, code: '101', description: 'You must provide at least 3 caracters' },
    description: { regExp: /[0-9a-zA-Z!¡#%@&ÁÉéÍíÓóÚúá]{3}/, code: '101', description: 'You must provide at least 3 caracters' },
    render: { regExp: /(true)|(false)/, code: '102', description: 'Render must be true or false' }
  }

  readonly about: ValidationObject = {
    name: { regExp: /[0-9a-zA-Z!¡#%@&ÁÉéÍíÓóÚúá]{3}/, code: '101', description: 'You must provide at least 3 caracters' },
    function: { regExp: /[0-9a-zA-Z!¡#%@&ÁÉéÍíÓóÚúá]{3}/, code: '101', description: 'You must provide at least 3 caracters' },
    description: { regExp: /[0-9a-zA-Z!¡#%@&ÁÉéÍíÓóÚúá]{3}/, code: '101', description: 'You must provide at least 3 caracters' },
    render: { regExp: /(true)|(false)/, code: '102', description: 'Render must be true or false' }

  }

  readonly volunteers: ValidationObject = {
    title: { regExp: /[0-9a-zA-Z!¡#%@&ÁÉéÍíÓóÚúá]{3}/, code: '101', description: 'You must provide at least 3 caracters' },
    content: { regExp: /[0-9a-zA-Z!¡#%@&ÁÉéÍíÓóÚúá]{3}/, code: '101', description: 'You must provide at least 3 caracters' },
    render: { regExp: /(true)|(false)/, code: '102', description: 'Render must be true or false' }

  }

  readonly news: ValidationObject = {
    title: { regExp: /[0-9a-zA-Z!¡#%@&ÁÉéÍíÓóÚúá]{3}/, code: '101', description: 'You must provide at least 3 caracters' },
    content: { regExp: /[0-9a-zA-Z!¡#%@&ÁÉéÍíÓóÚúá]{3}/, code: '101', description: 'You must provide at least 3 caracters' },
    author: { regExp: /[0-9a-zA-Z!¡#%@&ÁÉéÍíÓóÚúá]{3}/, code: '101', description: 'You must provide at least 3 caracters' },
    render: { regExp: /(true)|(false)/, code: '102', description: 'Render must be true or false' }

  }

  readonly validator: ValidationStrings
  constructor (validator: ValidationStrings) {
    this.validator = validator
  }

  validate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const validationKeys = Object.keys(this[this.validator])
    const validatorObject: ValidationObject = this[this.validator]
    const bodyData = req.body
    const response: ValidationError[] = []
    validationKeys.forEach(key => {
      if (validatorObject[key as keyof ValidationObject]?.regExp?.test(bodyData[key]?.toString())) {
        response.push({ ok: true, err: '' })
      } else {
        response.push({ ok: false, err: `Error: ${validatorObject[key as keyof ValidationObject]?.code.toString() as string} the key: ${key} needs to have ${validatorObject[key as keyof ValidationObject]?.description as string}` })
      }
    })
    Object.keys(req.body).forEach(key => {
      if (!(key in this[this.validator])) {
        delete req.body[key]
      }
    })
    if (response.find(res => !res.ok) !== undefined) {
      res.status(400).send(response)
    } else next()
  }
}
