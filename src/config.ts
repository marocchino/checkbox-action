import * as core from '@actions/core'

export type Action = 'check' | 'uncheck'
export type Error = 'error' | 'warn' | 'ignore'

export const list = core.getMultilineInput('list', {required: false})
export const matches = core.getInput('matches', {required: false})
export const action: Action = core.getInput('action', {
  required: true
}) as Action
export const error = core.getInput('error', {required: true}) as Error
export const token = core.getInput('GITHUB_TOKEN', {required: true})
