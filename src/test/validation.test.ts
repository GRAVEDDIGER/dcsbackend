/* eslint-disable no-new-wrappers */
import { describe, expect, it } from 'vitest'
import { ValMiddleWare } from '../services/validationTDD'
const { validate } = ValMiddleWare
describe('Validation midleWare Testing', () => {
  // DEPRECATED VALIDATION TEST DOESNT ADD ANY REAL INFORMATION
  // it('should be a function', () => {
  //   expect(typeof validate).toBe('function')
  // })
  it('should return {ok:false} if a text field is shorter than 3', () => {
    expect(validate({ description: 'te', render: true })).toContain({ ok: false })
  })
  it('should be false if render key is not present on body', () => {
    expect(validate({ description: 'texto' })).toContain({ ok: false })
  })
  it('should get a object on param', () => {
    expect(validate(1)).toContain({ ok: false })
    expect(validate('string')).toContain({ ok: false })
    expect(validate('boolean')).toContain({ ok: false })
    expect(validate('number')).toContain({ ok: false })
    expect(validate(new String('texto'))).toContain({ ok: false })
    expect(validate({ render: undefined })).toContain({ ok: false })
  })
  it('Should be true if object validates', () => {
    expect(validate({ description: 'texto', render: true })).toContain({ ok: true })
  })
})
