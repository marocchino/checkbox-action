import * as core from '@actions/core'
import {action, error} from './config'
import {getBody, contains, update, mutate} from './check'
import {
  getPreviousBody,
  getCurrentBody,
  getDiff,
  getCurrentChecked,
  getCurrentUnchecked
} from './detect'

async function run(): Promise<void> {
  try {
    if (action === 'detect') {
      const previousBody = getPreviousBody()
      const currentBody = getCurrentBody()
      const changed = getDiff(previousBody, currentBody)
      const checked = getCurrentChecked(currentBody)
      const unchecked = getCurrentUnchecked(currentBody)

      core.setOutput('checked', JSON.stringify(checked))
      core.setOutput('unchecked', JSON.stringify(unchecked))
      core.setOutput('changed', JSON.stringify(changed))
      return
    }
    let body = await getBody()
    if (!contains(body)) {
      switch (error) {
        case 'error':
          throw new Error('No matching items found')
        case 'warn':
          core.warning('No matching items found')
          return
      }
    }
    body = update(body)
    mutate(body)
  } catch (e) {
    if (e instanceof Error) {
      core.setFailed(e.message)
    }
  }
}

run()
