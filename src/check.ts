import { list, matches, action, token } from './config'
import * as github from '@actions/github'

export async function getBody(): Promise<string> {
  if (!github.context.payload.pull_request) {
    throw new Error('Triggered event is not a pull request')
  }
  if (github.context.payload.pull_request.body) {
    return github.context.payload.pull_request.body
  }

  const number = github.context.payload.pull_request.number
  const octokit = github.getOctokit(token)
  const result = await octokit.rest.issues.get({
    ...github.context.repo,
    issue_number: number,
  })
  return result.data.body || ''
}

export function contains(body: string): boolean {
  let result = false
  if (list.length === 0 && matches.length === 0) {
    throw new Error('No list or matches provided')
  }
  const letterFrom = action === 'check' ? ' ' : 'x'

  if (list.length > 0) {
    result = list.some((item) => {
      const regexp = new RegExp(`- \\[${letterFrom}\\] ${item}$`, 'm')
      return regexp.test(body)
    })
  }
  if (matches.length > 0) {
    const regexp = new RegExp(`- \\[${letterFrom}\\] (?:${matches})$`, 'm')
    result = result || regexp.test(body)
  }
  return result
}

export function update(body: string): string {
  const letterFrom = action === 'check' ? ' ' : 'x'
  const letterTo = action === 'check' ? 'x' : ' '

  if (list.length > 0) {
    for (const item of list) {
      const regexp = new RegExp(`- \\[${letterFrom}\\] ${item}$`, 'mg')
      body = body.replace(regexp, `- [${letterTo}] ${item}`)
    }
  }
  if (matches.length > 0) {
    const regexp = new RegExp(`- \\[${letterFrom}\\] (${matches})$`, 'mg')
    body = body.replace(regexp, `- [${letterTo}] $1`)
  }
  return body
}

export function mutate(body: string): void {
  if (!github.context?.payload?.pull_request?.number) {
    throw new Error('Triggered event is not a pull request')
  }
  const number = github.context.payload.pull_request.number
  const octokit = github.getOctokit(token)
  octokit.rest.issues.update({
    ...github.context.repo,
    issue_number: number,
    body
  })
}
