import { beforeEach, afterEach, expect, jest, describe, test } from '@jest/globals'

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

describe('contains', () => {
  test('throw error when no list or matches', async () => {
    const { contains } = await import('../src/check')
    const body = ''
    expect(() => contains(body)).toThrowError('No list or matches provided')
  })


  test.each([
    {
      condition: 'not found',
      list: 'rev',
      action: 'check',
      body: '# checklist\n- [ ] test ok\n- [ ] lint ok\n- [ ] review',
      expected: false,
    },
    {
      condition: 'an list item unchecked',
      list: 'test ok',
      action: 'check',
      body: '# checklist\n- [ ] test ok\n- [ ] lint ok\n- [ ] review',
      expected: true,
    },
    {
      condition: 'an list item checked',
      list: 'test ok',
      action: 'check',
      body: '# checklist\n- [x] test ok\n- [ ] lint ok\n- [ ] review',
      expected: false,
    },
    {
      condition: 'one of match items checked',
      list: 'test ok\nlint ok',
      action: 'check',
      body: '# checklist\n- [x] test ok\n- [ ] lint ok\n- [x] review',
      expected: true,
    },
    {
      condition: 'and an no list',
      list: 'rev',
      action: 'uncheck',
      body: '# checklist\n- [x] test ok\n- [x] lint ok\n- [x] review',
      expected: false,
    },
    {
      condition: 'an list item unchecked',
      list: 'test ok',
      action: 'uncheck',
      body: '# checklist\n- [ ] test ok\n- [x] lint ok\n- [x] review',
      expected: false,
    },
    {
      condition: 'an list item checked',
      list: 'test ok',
      action: 'uncheck',
      body: '# checklist\n- [x] test ok\n- [x] lint ok\n- [x] review',
      expected: true,
    },
    {
      condition: 'one of match items checked',
      list: 'test ok\nlint ok',
      action: 'uncheck',
      body: '# checklist\n- [x] test ok\n- [ ] lint ok\n- [x] review',
      expected: true,
    },
  ])(`returns $expected when $action and $condition`, async ({ list, action, body, expected }) => {
    process.env['INPUT_LIST'] = list
    process.env['INPUT_ACTION'] = action
    const { contains } = await import('../src/check')
    expect(contains(body)).toEqual(expected)
  })

  test.each([
    {
      condition: 'no match items',
      matches: '.+checked',
      action: 'check',
      body: '# checklist\n- [ ] test ok\n- [ ] lint ok\n- [ ] review',
      expected: false,
    },
    {
      condition: 'match item unchecked',
      matches: '.+ok',
      action: 'check',
      body: '# checklist\n- [ ] test ok\n- [ ] lint ok\n- [ ] review',
      expected: true,
    },
    {
      condition: 'match item checked',
      matches: '.+ok',
      action: 'check',
      body: '# checklist\n- [x] test ok\n- [x] lint ok\n- [x] review',
      expected: false,
    },
    {
      condition: 'no match items',
      matches: '.+checked',
      action: 'uncheck',
      body: '# checklist\n- [x] test ok\n- [x] lint ok\n- [x] review',
      expected: false,
    },
    {
      condition: 'match item unchecked',
      matches: '.+ok',
      action: 'uncheck',
      body: '# checklist\n- [ ] test ok\n- [ ] lint ok\n- [ ] review',
      expected: false,
    },
    {
      condition: 'match item checked',
      matches: '.+ok',
      action: 'uncheck',
      body: '# checklist\n- [x] test ok\n- [x] lint ok\n- [x] review',
      expected: true,
    },
  ])('returns $expected when $action and $condition', async ({ matches, action, body, expected }) => {
    process.env['INPUT_MATCHES'] = matches
    process.env['INPUT_ACTION'] = action
    const { contains } = await import('../src/check')
    expect(contains(body)).toEqual(expected)
  })
})

describe('update', () => {
  test.each([
    {
      condition: 'an list item unchecked',
      list: 'test ok',
      action: 'check',
      body: '# checklist\n- [ ] test ok\n- [ ] lint ok\n- [ ] review',
      expected: '# checklist\n- [x] test ok\n- [ ] lint ok\n- [ ] review',
    },
    {
      condition: 'one of match items checked',
      list: 'test ok\nlint ok',
      action: 'check',
      body: '# checklist\n- [x] test ok\n- [ ] lint ok\n- [ ] review',
      expected: '# checklist\n- [x] test ok\n- [x] lint ok\n- [ ] review',
    },
    {
      condition: 'an list item checked',
      list: 'test ok',
      action: 'uncheck',
      body: '# checklist\n- [x] test ok\n- [x] lint ok\n- [x] review',
      expected: '# checklist\n- [ ] test ok\n- [x] lint ok\n- [x] review',
    },
    {
      condition: 'one of match items checked',
      list: 'test ok\nlint ok',
      action: 'uncheck',
      body: '# checklist\n- [x] test ok\n- [ ] lint ok\n- [x] review',
      expected: '# checklist\n- [ ] test ok\n- [ ] lint ok\n- [x] review',
    },
  ])('change from $body\n to $expected\n when $action and $condition', async ({ list, action, body, expected }) => {
    process.env['INPUT_LIST'] = list
    process.env['INPUT_ACTION'] = action
    const { update } = await import('../src/check')
    expect(update(body)).toEqual(expected)
  })

  test.each([
    {
      condition: 'match item unchecked',
      matches: '.+ok',
      action: 'check',
      body: '# checklist\n- [ ] test ok\n- [ ] lint ok\n- [ ] review',
      expected: '# checklist\n- [x] test ok\n- [x] lint ok\n- [ ] review',
    },
    {
      condition: 'match item checked',
      matches: '.+ok',
      action: 'uncheck',
      body: '# checklist\n- [x] test ok\n- [x] lint ok\n- [x] review',
      expected: '# checklist\n- [ ] test ok\n- [ ] lint ok\n- [x] review',
    }
  ])('change from $body\n to $expected\n when $action and $condition', async ({ matches, action, body, expected }) => {
    process.env['INPUT_MATCHES'] = matches
    process.env['INPUT_ACTION'] = action
    const { update } = await import('../src/check')
    expect(update(body)).toEqual(expected)
  })
})
