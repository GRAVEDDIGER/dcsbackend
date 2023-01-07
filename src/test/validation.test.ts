/* eslint-disable no-new-wrappers */
import { describe, expect, it } from 'vitest'
import { ValMiddleWare } from '../services/validationTDD'
// function validate () {}
// const isObject = (obj) => Object.prototype.toString.call(obj) === '[object Object]'
const { validate } = ValMiddleWare
describe('Validation midleWare Testing', () => {
  it('should be a function', () => {
    expect(typeof validate).toBe('function')
  })
  it('should validate string fields larger than 3 letters', () => {
    expect(validate({ description: 'te', render: true })).toBe(false)
  })
  it('should be false if render key is not present on body', () => {
    expect(validate({ description: 'texto' })).toBe(false)
  })
  it('should get a object on param', () => {
    expect(validate(1)).toBe(false)
    expect(validate('string')).toBe(false)
    expect(validate('boolean')).toBe(false)
    expect(validate('number')).toBe(false)
    expect(validate(new String('texto'))).toBe(false)
    expect(validate({ render: undefined })).toBe(false)
  })
  it('Should be true if object validates', () => {
    expect(validate({ description: 'texto', render: true })).toBe(true)
  })
})
