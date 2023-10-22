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

export function getDiff(
  previousBody: string,
  currentBody: string
): {checked: string[]; unchecked: string[]} {
  const previousLines = previousBody.split('\n')
  const currentLines = currentBody.split('\n')

  const checkRegexp = /^\s*- \[x\] /
  const uncheckRegexp = /^\s*- \[ \] /
  const prevChecked: string[] = previousLines
    .filter(line => checkRegexp.test(line))
    .map(line => line.replace(checkRegexp, ''))
  const prevUnchecked: string[] = previousLines
    .filter(line => uncheckRegexp.test(line))
    .map(line => line.replace(uncheckRegexp, ''))
  const currChecked: string[] = currentLines
    .filter(line => checkRegexp.test(line))
    .map(line => line.replace(checkRegexp, ''))
  const currUnchecked: string[] = currentLines
    .filter(line => uncheckRegexp.test(line))
    .map(line => line.replace(uncheckRegexp, ''))
  const checked = currChecked.filter(line => prevUnchecked.includes(line))
  const unchecked = currUnchecked.filter(line => prevChecked.includes(line))

  return {checked, unchecked}
}
