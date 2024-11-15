# Workflow dispatch action

![CI](https://github.com/roamingowl/workflow-dispatch/actions/workflows/check-and-test.yml/badge.svg)
[![CodeQL](https://github.com/roamingowl/workflow-dispatch/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/roamingowl/workflow-dispatch/actions/workflows/codeql-analysis.yml)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=roamingowl_workflow-dispatch&metric=coverage)](https://sonarcloud.io/summary/new_code?id=roamingowl_template-output-with-eta)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=roamingowl_workflow-dispatch&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=roamingowl_template-output-with-eta)
![Esbuild Badge](https://img.shields.io/badge/esbuild-^0.24.0-FFCF00)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=roamingowl_workflow-dispatch&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=roamingowl_template-output-with-eta)


## Description
JavaScript action (written in TypeScript) to dispatch a workflow with a given inputs.

## Inputs

| name | description                                                                                                              | type | required | default |
| --- |--------------------------------------------------------------------------------------------------------------------------|---------------| --- |---|
| `template` | <p>Template string to render (Supports [ETA](https://eta.js.org/) syntax). Or a path to file containing template.</p>    | `string` | `true`        | `""` |
| `varName` | <p>Name of the variable which holds all data to be used in the template (variables).</p>                                 | `string` | `false`       | `it` |
| `variables` | <p>Variables to substitute in the template. You can use YAML, JSON or dotenv format. See [examples](#usage-examples)</p> | `string` | `false`       | `""` |

## Outputs

| name | type                                      | description                      |
| --- |-------------------------------------------|----------------------------------|
| `text` | `string` |  <p>Rendered template string</p> |

## Usage examples

...

# Issues

This whole project have to be in commonJs because [GitHub actions don't support ES6 modules](https://github.com/actions/github-script/issues/457).

# License
The scripts and documentation in this project are released under the [MIT License](LICENSE)