<p align="center">
  <a href="https://github.com/marocchino/checkbox-action/actions"><img alt="checkbox-action status" src="https://github.com/actions/checkbox-action/workflows/build-test/badge.svg"></a>
</p>

# Checkbox Action

It works in two main ways:
1. Checks or unchecks a checkbox in the body of the pull request.
2. Returns the list, confirming the change in the checkbox.

This library runs with GitHub Actions. If you feel that the example grammar below is not friendly enough, we recommend reading [this page](https://docs.github.com/en/actions) first.

## Usage

I think the most common use is to visualize the results of CI execution, and here's an example.

```yaml
  test: # make sure the action works on a clean machine without building
    runs-on: ubuntu-latest
    permissions:
      pull-requests: write
    steps:
      - uses: actions/checkout@v3
      - uses: marocchino/checkbox-action@v1
        with:
          list: 'test ok'
          action: 'uncheck'
          error: 'warn'
      - run: |
          yarn
      - run: |
          yarn all
      - uses: marocchino/checkbox-action@v1
        with:
          list: 'test ok'
          action: 'check'
          error: 'warn'
```

Here's an example of checking to see if a particular checkbox has been checked recently.
Unchecking works the same way.
> NOTE: I don't think detect will work again on events other than edit.

```yaml
on:
  pull_request:
    types:
      - edited
jobs:
  detect:
    runs-on: ubuntu-latest
    outputs:
      checked: ${{ steps.detect.outputs.checked }}
    steps:
      - uses: marocchino/checkbox-action@v1
        id: detect
        with:
          action: 'detect'
  test:
    needs: detect
    if: ${{ contains(fromJSON(needs.detect.outputs.checked), 'trigger test') }}
    runs-on: ubuntu-latest
    steps:
      - run: echo Add your CI here
```

## Inputs

### `action`

**Optional** check, uncheck or detect. This default to `'check'`

### `list`

**Optional** However, one of the list and matches required when check, uncheck
action.
Line separated List of checkboxes to modify.

### `matches`

**Optional** However, one of the list and matches required when check, uncheck
action.
Regular expression for the checkbox to modify.

### `error`

**Optional** error, warn or ignore. Specifies whether to skip or raise an error when not found. This defaults to error

### `GITHUB_TOKEN`

**Optional** The GitHub access token (e.g. secrets.GITHUB_TOKEN) used to update the body. This defaults to `{{ github.token }}`.

## Outputs

Only available on `detect` action.

### `checked`

Returns a list of checked items from the previous modification as json in []string.

### `unchecked`

Returns a list of checked items from the previous modification as json in []string.
