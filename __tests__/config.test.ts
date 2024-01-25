import {beforeEach, afterEach, expect, jest, test} from '@jest/globals'
import type {ConfigPayload} from '../src/config'

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
  const config = await import('../src/config')

  const expected: ConfigPayload = {
    list: [],
    matches: '',
    error: 'error',
    action: 'check',
    token: 'some-token'
  }

  expect<ConfigPayload>(config).toMatchObject(expected)
})
