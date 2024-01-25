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

export function getPreviousChecked(previousLines: string[]): string[] {
  return previousLines
    .filter(line => CHECK_REGEXP.test(line))
    .map(line =>
      line
        .replace(CHECK_REGEXP, '')
        // remove trailing newline
        .replace(/[\n\r]/, '')
    )
}

export function getPreviousUnchecked(previousLines: string[]): string[] {
  return previousLines
    .filter(line => UNCHECK_REGEXP.test(line))
    .map(line =>
      line
        .replace(UNCHECK_REGEXP, '')
        // remove trailing newline
        .replace(/[\n\r]/, '')
    )
}

export function getCurrentChecked(currentLines: string[]): string[] {
  return currentLines
    .filter(line => CHECK_REGEXP.test(line))
    .map(line =>
      line
        .replace(CHECK_REGEXP, '')
        // remove trailing newline
        .replace(/[\n\r]/, '')
    )
}

export function getCurrentUnchecked(currentLines: string[]): string[] {
  return currentLines
    .filter(line => UNCHECK_REGEXP.test(line))
    .map(line =>
      line
        .replace(UNCHECK_REGEXP, '')
        // remove trailing newline
        .replace(/[\n\r]/, '')
    )
}

export function getDiff(
  previousLines: string[],
  currentLines: string[]
): {checked: string[]; unchecked: string[]} {
  const prevChecked = getPreviousChecked(previousLines)
  const prevUnchecked = getPreviousUnchecked(previousLines)
  const currChecked = getCurrentChecked(currentLines)
  const currUnchecked = getCurrentUnchecked(currentLines)

  const checked = currChecked.filter(line => prevUnchecked.includes(line))
  const unchecked = currUnchecked.filter(line => prevChecked.includes(line))

  return {checked, unchecked}
}
