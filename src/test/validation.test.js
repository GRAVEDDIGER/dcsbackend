/* eslint-disable no-new-wrappers */

import { describe, expect, it } from 'vitest'

// function validate () {}
const isObject = (obj) => {
  return Object.prototype.toString.call(obj) === '[object Object]'
}
const validate = (req, res) => {
  if (!isObject(req)) {
    throw new Error('Req must be a Object')
  }
}
describe('should be a function', () => {
  it('should be a function', () => {
    expect(typeof validate).toBe('function')
  })
  it('should get a object param number 1', () => {
    expect(() => validate(1, {})).toThrow()
    expect(() => validate('string', {})).toThrow()
    expect(() => validate('boolean', {})).toThrow()
    expect(() => validate('number', {})).toThrow()
    expect(() => validate(new String('texto'), {})).toThrow()
  })
  it('should get a object param number 2', () => {
    expect(() => validate({ body: true }, 1)).toThrow()
    expect(() => validate({}, 'string')).toThrow()
    expect(() => validate({}, 'boolean')).toThrow()
    expect(() => validate({}, 'number')).toThrow()
    expect(() => validate({}, new String('texto'))).toThrow()
  })
})
