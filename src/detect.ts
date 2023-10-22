import * as github from '@actions/github'

export function getPreviousBody(): string {
  if (!github.context.payload.pull_request) {
    throw new Error('This action only supports pull_request events')
  }
  return github.context.payload.changes?.body?.from || ''
}

export function getCurrentBody(): string {
  if (!github.context.payload.pull_request) {
    throw new Error('This action only supports pull_request events')
  }

  return github.context.payload.pull_request.body || ''
}

const CHECK_REGEXP = /^\s*- \[x\] /
const UNCHECK_REGEXP = /^\s*- \[ \] /

export function getPreviousChecked(previousBody: string): string[] {
  const previousLines = previousBody.split('\n')
  return previousLines
    .filter(line => CHECK_REGEXP.test(line))
    .map(line => line.replace(CHECK_REGEXP, ''))
}

export function getPreviousUnchecked(previousBody: string): string[] {
  const previousLines = previousBody.split('\n')
  return previousLines
    .filter(line => UNCHECK_REGEXP.test(line))
    .map(line => line.replace(UNCHECK_REGEXP, ''))
}

export function getCurrentChecked(currentBody: string): string[] {
  const currentLines = currentBody.split('\n')
  return currentLines
    .filter(line => CHECK_REGEXP.test(line))
    .map(line => line.replace(CHECK_REGEXP, ''))
}

export function getCurrentUnchecked(currentBody: string): string[] {
  const currentLines = currentBody.split('\n')
  return currentLines
    .filter(line => UNCHECK_REGEXP.test(line))
    .map(line => line.replace(UNCHECK_REGEXP, ''))
}

export function getDiff(
  previousBody: string,
  currentBody: string
): {checked: string[]; unchecked: string[]} {
  const prevChecked = getPreviousChecked(previousBody)
  const prevUnchecked = getPreviousUnchecked(previousBody)
  const currChecked = getCurrentChecked(currentBody)
  const currUnchecked = getCurrentUnchecked(currentBody)

  const checked = currChecked.filter(line => prevUnchecked.includes(line))
  const unchecked = currUnchecked.filter(line => prevChecked.includes(line))

  return {checked, unchecked}
}
