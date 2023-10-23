import * as core from '@actions/core'

/**
 * Action
 */
export const actions = ['check', 'uncheck', 'detect', 'current-detect'] as const

const isAction = (action: string): action is Action => {
  return actions.includes(action as Action)
}

const getAction = (): Action => {
  const action = core.getInput('action', {required: true})
  if (!isAction(action)) {
    throw new Error(`Invalid action: ${action}`)
  }
  return action
}

export type Action = (typeof actions)[number]
export const action = getAction()

/**
 * Error Level
 */
const errors = ['error', 'warn', 'ignore'] as const
const isError = (error: string): error is ErrorLevel => {
  return errors.includes(error as ErrorLevel)
}
const getError = (): ErrorLevel => {
  const error = core.getInput('error', {required: true})
  if (!isError(error)) {
    throw new Error(`Invalid error: ${error}`)
  }
  return error
}

/**
 * How verbose should feedback be?
 */
export type ErrorLevel = 'error' | 'warn' | 'ignore'
export const error = getError()

/**
 * List of checkboxes to operate on
 */
export const list = core.getMultilineInput('list', {required: false})

/**
 * A regex to match checkboxes which should be operated on
 */
export const matches = core.getInput('matches', {required: false})

export const token = core.getInput('GITHUB_TOKEN', {required: true})

export type ConfigPayload = {
  /**
   * @see {@link list}
   */
  list: string[]
  /**
   * @see {@link matches}
   */
  matches: string
  /**
   * @see {@link Action}
   */
  action: Action
  /**
   * @see {@link ErrorLevel}
   */
  error: ErrorLevel
  /**
   * @see {@link token}
   */
  token: string
}
