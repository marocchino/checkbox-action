import {expect, describe, test} from '@jest/globals'
import {getCurrentChecked, getCurrentUnchecked, getDiff} from '../src/detect'

describe('getDiff', () => {
  test('should return checked and unchecked items', () => {
    const previousBody = `
# Title line
normal line
abnormal line - [ ] item 3
abnormal line - [x] item 4

- [x] item 0 unchanged
- [x] item 1 unchecked
- [ ] item 2 unchanged
  - [ ] item 2-1 checked
  - [ ] item 2-2 unchanged
  - [ ] item 2-3 checked
  - [x] item 2-4 unchecked

removed line
`
    const currentBody = `
# Title line
normal line
abnormal line - [ ] item 3
abnormal line - [x] item 4
added line

- [x] item 0 unchanged
- [ ] item 1 unchecked
- [ ] item 2 unchanged
  - [x] item 2-1 checked
  - [ ] item 2-2 unchanged
  - [x] item 2-3 checked
  - [ ] item 2-4 unchecked
`

    const {checked, unchecked} = getDiff(previousBody, currentBody)
    expect(checked).toEqual(['item 2-1 checked', 'item 2-3 checked'])
    expect(unchecked).toEqual(['item 1 unchecked', 'item 2-4 unchecked'])
  })
})

describe('getCurrentChecked', () => {
  test('should return all checked items', () => {
    const currentBody = `
# Title line
normal line
abnormal line - [ ] item 3
abnormal line - [x] item 4
added line

- [x] item 0 unchanged
- [ ] item 1 unchecked
- [ ] item 2 unchanged
  - [x] item 2-1 checked
  - [ ] item 2-2 unchanged
  - [x] item 2-3 checked
  - [ ] item 2-4 unchecked
`

    const checked = getCurrentChecked(currentBody)
    expect(checked).toEqual([
      'item 0 unchanged',
      'item 2-1 checked',
      'item 2-3 checked'
    ])
  })
})
describe('getCurrentUnChecked', () => {
  test('should return all unchecked items', () => {
    const currentBody = `
# Title line
normal line
abnormal line - [ ] item 3
abnormal line - [x] item 4
added line

- [x] item 0 unchanged
- [ ] item 1 unchecked
- [ ] item 2 unchanged
  - [x] item 2-1 checked
  - [ ] item 2-2 unchanged
  - [x] item 2-3 checked
  - [ ] item 2-4 unchecked
`

    const checked = getCurrentUnchecked(currentBody)
    expect(checked).toEqual([
      'item 1 unchecked',
      'item 2 unchanged',
      'item 2-2 unchanged',
      'item 2-4 unchecked'
    ])
  })
})
