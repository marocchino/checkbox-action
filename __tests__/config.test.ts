import {beforeEach, afterEach, expect, jest, test} from '@jest/globals'
import type {Action, ErrorLevel} from '../src/config'

beforeEach(() => {
  process.env['INPUT_LIST'] = ''
  process.env['INPUT_MATCHES'] = ''
  process.env['INPUT_ACTION'] = 'check'
  process.env['INPUT_ERROR'] = 'error'
  process.env['INPUT_GITHUB_TOKEN'] = 'some-token'
})

afterEach(() => {
  jest.resetModules()
  delete process.env['INPUT_LIST']
  delete process.env['INPUT_MATCHES']
  delete process.env['INPUT_ACTION']
  delete process.env['INPUT_ERROR']
  delete process.env['INPUT_GITHUB_TOKEN']
})

test('config', async () => {
  expect(require('../src/config')).toMatchObject({
    list: [],
    matches: '',
    error: 'error' as ErrorLevel,
    action: 'check' as Action,
    token: 'some-token'
  })
})
