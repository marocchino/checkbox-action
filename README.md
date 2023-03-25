<p align="center">
  <a href="https://github.com/marocchino/checkbox-action/actions"><img alt="checkbox-action status" src="https://github.com/actions/checkbox-action/workflows/build-test/badge.svg"></a>
</p>

# Checkbox Action

Checks or unchecks a checkbox in the body of the pull request.
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

## Inputs

### `list`

**Optional** However, one of the list and matches required.
Line separated List of checkboxes to modify.

### `matches`

**Optional** However, one of the list and matches required.
Regular expression for the checkbox to modify.

### `action`

**Optional** check, uncheck. This default to `'check'`

### `error`

**Optional** error, warn or ignore. Specifies whether to skip or raise an error when not found. This defaults to error

### `GITHUB_TOKEN`

**Optional** The GitHub access token (e.g. secrets.GITHUB_TOKEN) used to update the body. This defaults to `{{ github.token }}`.

## Outputs

No output
