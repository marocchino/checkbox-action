import * as core from '@actions/core'
import { error } from './config'
import { getBody, contains, update, mutate } from './check'

async function run(): Promise<void> {
  try {
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
