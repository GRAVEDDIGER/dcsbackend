/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { NextFunction, Request, Response } from 'express'
import { ValidationStrings, ValidationObject, ValidationType } from '../types'
import { DataResponseClass } from '../services/firebase'

export class Validation implements ValidationType {
  readonly welcome: ValidationObject = {
    title: /[0-9a-zA-Z]{3}/,
    description: /[0-9a-zA-Z]{3}/,
    render: /(true)|(false)/
  }

  readonly about: ValidationObject = {
    name: /[0-9a-zA-Z]{3}/,
    function: /[0-9a-zA-Z]{3}/,
    description: /[0-9a-zA-Z]{3}/,
    render: /(true)|(false)/

  }

  readonly volunteers: ValidationObject = {
    title: /[0-9a-zA-Z]{3}/,
    content: /[0-9a-zA-Z]{3}/,
    render: /(true)|(false)/

  }

  readonly news: ValidationObject = {
    title: /[0-9a-zA-Z]{3}/,
    content: /[0-9a-zA-Z]{3}/,
    author: /[0-9a-zA-Z]{3}/,
    render: /(true)|(false)/

  }

  readonly validator: ValidationStrings
  constructor (validator: ValidationStrings) {
    this.validator = validator
  }

  async validate (req: Request, res: Response, next: NextFunction): Promise<void> {
    const validationKeys = Object.keys(this[this.validator])
    const validatorObject: ValidationObject = this[this.validator]
    const bodyData = req.body
    const response: boolean[] = []
    validationKeys.forEach(key => {
      if (validatorObject[key as keyof ValidationObject]?.test(bodyData[key].toString())) {
        response.push(true)
      } else response.push(false)
    })
    Object.keys(req.body).forEach(key => {
      if (!(key in this[this.validator])) { req.body[key] = undefined }
    })
    if (response.includes(false)) res.send(new DataResponseClass([], 403, 'Invalid data', 'Didnt pass validation', false))
    next()
  }
}
